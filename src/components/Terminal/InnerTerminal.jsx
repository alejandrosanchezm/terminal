/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import './style.css';
import { fileSystem } from './fileSystem';
import { findNodeByPath, getFinalPathForCd, findNodeByPathArray, parsePathSegments } from './pathUtils';
import { formatNow, formatNowLocale } from './dateUtils';

const LOCAL_STORAGE_TERMINAL_KEY = "LOCAL_STORAGE_TERMINAL_KEY";

function InnerTerminal() {
    const [lines, setLines] = useState(() => {
        let item = localStorage.getItem(LOCAL_STORAGE_TERMINAL_KEY)
        if (item != null && item !== undefined) {
            return JSON.parse(item);
        }
        return [];
    });

    const [isSudo, setIsSudo] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [sudoCommando, setSudoCommand] = useState(null);
    const [password, setPassword] = useState('');
    const [isSleeping, setIsSleeping] = useState(false);
    const [failedSudoers, setFailedSudoers] = useState(0);
    const maxFailedSudoers = 3;

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TERMINAL_KEY, JSON.stringify(lines))
        const contenedor = document.getElementById("terminal-container");
        contenedor.scrollTop = contenedor.scrollHeight;
    }, [lines])

    const validPassword = "validPassword";

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentCommand, setCurrentCommand] = useState('');

    const prompt = ' ~ % ';
    const rootPrompt = ' --> root ~ % ';
    const [currentPrompt, setCurrentPrompt] = useState(prompt);

    const terminalRef = useRef(null);

    const [currentPath, setCurrentPath] = useState(['']);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (historyIndex === -1) {
            setCurrentCommand('');
        } else {
            setCurrentCommand(history[historyIndex] || '');
        }
    }, [historyIndex, history]);

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        setCurrentCommand((prev) => prev + pastedText);
    };

    const getCurrentNode = () => {
        let node = fileSystem;
        for (let i = 1; i < currentPath.length; i++) {
            const sub = currentPath[i];
            if (node.type === 'folder' && node.children) {
                const found = node.children.find((child) => child.name === sub);
                if (found) {
                    node = found;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        return node;
    };

    const pathToString = (pathArr) => {
        if (pathArr.length <= 1) {
            return '/';
        }
        return '/' + pathArr.slice(1).join('/');
    };

    const handleLs = (args = []) => {
        const node = getCurrentNode();
        if (!node) {
            return ['Error: ruta inválida'];
        }
        const validArgs = ['-a', '-l', '-al', '-la'];
        const invalidArgs = args.filter(arg => !validArgs.includes(arg));

        if (invalidArgs.length > 0) {
            return [`Error: argumento inválido '${invalidArgs.join(', ')}'`, 'Uso: ls [-al]'];
        }

        let joinedArgs = args.join("")

        const showLongList = joinedArgs.includes('l');
        const showAll = joinedArgs.includes('a');

        if (node.type !== 'folder' || !node.children) {
            return [`${pathToString(currentPath)} no es un directorio`];
        }

        const filteredChildren = showAll
            ? node.children
            : node.children.filter(child => !child.name.startsWith('.'));

        if (showLongList) {
            return filteredChildren.map(child => {
                const permissions = getPermissions(child);
                const owner = child.owner || 'user';
                const group = child.group || 'group';
                const size = child.size || '0';
                const lastModified = child.lastModified || 'never               ';
                return `${permissions}  ${owner}  ${group}  ${size}  ${lastModified}  ${child.name}`;
            });
        }

        const names = filteredChildren.map((child) => child.name);
        return [names.join('  ')];
    };

    const getPermissions = (child) => {
        return child.isDirectory ? 'd---------' : '-r--------';
    };

    const handlePwd = () => {
        return [pathToString(currentPath)];
    };

    const handleSleep = (args) => {
        if (args[0] == 'infinite') {
            return ['No te pases! 😆']
        }
        if (isNaN(args[0])) {
            return [`sleep: Opción ilegal -- ${args[0]}`, 'Uso: sleep <number> (seconds)']
        }
        if (parseInt(args[0]) > 1000) {
            return ['¿No eres demasiado dormilón? 😴']
        }
        if (parseInt(args[0]) <= 0) {
            return ['Si claro, ahora podemos viajar en el tiempo...']
        }
        setIsSleeping(true);
        setTimeout(() => {
            setIsSleeping(false)
        }, [parseInt(args[0]) * 1000])
        return ['']
    }

    const handleCd = (args) => {
        const node = getCurrentNode();
        if (!node) {
            return [`No se puede acceder a ${pathToString(currentPath)}`];
        }

        if (args.length === 0) {
            // cd sin argumentos => raíz
            setCurrentPath(['']);
            return [];
        }

        // Si el usuario puso algo como "/home/usuario" o "etc"
        const targetPath = args[0];

        // Casos especiales “cd /” y “cd ..” se integran mejor si parseamos, 
        // pero si quieres dejarlos como “atajos”:
        if (targetPath === '/') {
            setCurrentPath(['']);
            return [];
        }
        if (targetPath === '..') {
            if (currentPath.length > 1) {
                setCurrentPath(prev => prev.slice(0, -1));
            }
            return [];
        }
        const newPath = getFinalPathForCd(currentPath, targetPath);
        const finalNode = findNodeByPathArray(newPath, fileSystem);

        if (!finalNode) {
            return [`No existe la ruta '${targetPath}'`];
        }
        if (finalNode.type !== 'folder') {
            return [`'${targetPath}': no es un directorio.`];
        }
        setCurrentPath(newPath);
        return [];
    };

    const handleCat = (args) => {
        if (args.length === 0) {
            return ['Uso: cat <archivo>'];
        }
        const filePath = args[0];
        const node = findNodeByPath(filePath, currentPath, fileSystem);
        if (!node || node.type !== 'file') {
            return [`Archivo no encontrado: ${filePath}`];
        }
        if (node.content) {
            return node.content.split('\n');
        } else {
            return [`(El archivo está vacío)`];
        }
    };

    const handleMKDir = (args) => {
        if (args.length === 0) {
            return ['Uso: mkdir <ruta>'];
        }

        const pathArg = args[0];
        const segments = parsePathSegments(pathArg, currentPath);
        if (segments.length === 0) {
            return [`No se puede crear carpeta con ruta '${pathArg}'`];
        }
        const folderName = segments[segments.length - 1];
        const parentSegments = segments.slice(0, -1);
        const parentPathArray = [''].concat(parentSegments);
        const parentNode = findNodeByPathArray(parentPathArray, fileSystem);

        if (!parentNode) {
            return [`No existe la ruta '${pathArg}' (padre inexistente)`];
        }
        if (parentNode.type !== 'folder') {
            return [`No se puede crear dentro de un archivo: '${pathArg}'`];
        }
        if (parentNode.children.some(child => child.name === folderName)) {
            return [`Ya existe un fichero o carpeta con el nombre '${folderName}'`];
        }
        const newFolder = {
            name: folderName,
            type: 'folder',
            children: []
        };
        parentNode.children.push(newFolder);
        return [];
    }

    const handleTouch = (args, content = '') => {
        if (args.length === 0) {
            return ['Uso: mkdir <ruta>'];
        }

        const pathArg = args[0];
        const segments = parsePathSegments(pathArg, currentPath);
        if (segments.length === 0) {
            return [`No se puede crear carpeta con ruta '${pathArg}'`];
        }
        const folderName = segments[segments.length - 1];
        const parentSegments = segments.slice(0, -1);
        const parentPathArray = [''].concat(parentSegments);
        const parentNode = findNodeByPathArray(parentPathArray, fileSystem);

        if (!parentNode) {
            return [`No existe la ruta '${pathArg}' (padre inexistente)`];
        }
        if (parentNode.type !== 'folder') {
            return [`No se puede crear dentro de un archivo: '${pathArg}'`];
        }
        if (parentNode.children.some(child => child.name === folderName)) {
            return [`Ya existe un fichero o carpeta con el nombre '${folderName}'`];
        }
        const newFolder = {
            name: folderName,
            type: 'file',
            content: content,
            lastModified: formatNowLocale()
        };
        parentNode.children.push(newFolder);
        return [];
    }

    const handleEcho = (args) => {
        let item = args.join(" ");
        if (item.toLowerCase().includes("como estas")) {
            return ["Bien, y tu?"]
        }
        if ((item.startsWith("'") && item.endsWith("'")) || (item.startsWith('"') && item.endsWith('"'))) {
            item = item.slice(1, -1)
        }
        return [item]
    }

    const processCommand = (cmd, tmpSudo = false) => {
        let trimmed = cmd.trim();
        if (!trimmed) return [];
        let symbol = null;
        let pipeline = null;
        if (trimmed.includes('>')) symbol = '>'
        if (trimmed.includes('>>')) symbol = '>>'
        if (symbol != null) {
            let parts = trimmed.split(symbol)
            trimmed = parts[0].trim()
            pipeline = parts[1].trim()
        }
        const [command, ...args] = trimmed.split(' ');
        let response = [];

        switch (command) {
            case 'wofn1r':
                response = ['Su: Sorry']
                break;
            case 'sleep':
                response = handleSleep(args)
                break;
            case 'su':
                if (tmpSudo && failedSudoers < maxFailedSudoers) {
                    setIsSudo(true)
                    setCurrentPrompt(rootPrompt)
                    response = ['']
                    break;
                }
                response = ['Su: Sorry']
                break;
            case 'clear':
                response = [];
                break;
            case 'pwd':
                response = handlePwd();
                break;
            case 'cat':
                response = handleCat(args);
                break;
            case 'ls':
                response = handleLs(args);
                break;
            case 'echo':
                response = handleEcho(args);
                break;
            case 'cd':
                response = handleCd(args);
                break;
            case 'mkdir':
                if (isSudo || tmpSudo) {
                    response = handleMKDir(args)
                    break;
                }
                response = ['Lo siento, no tienes permisos para hacer esto.']
                break;
            case 'touch':
                response = handleTouch(args)
                break;
            case 'date':
                response = [formatNow()]
                break;
            case 'exit':
                if (isSudo) {
                    setIsSudo(false)
                    setCurrentPrompt(prompt)
                    return ['Bye! 👋']
                }
                return ['Hacia donde quieres salir?']
            default:
                return [`Comando no reconocido: ${command}`];
        }
        if (pipeline == null) return response;
        return handlePipe(response, pipeline, symbol)
    };

    function handlePipe(commandOutput, path, append) {
        let node = findNodeByPath(path, currentPath, fileSystem);
        let joinedOutput = commandOutput.join("\n")
        if (node == null) {
            let response = handleTouch([path], joinedOutput, append == '>>')
            if (response != []) return response;
        }
        else {
            append == '>>' ? node.content = node.content + "\n" + joinedOutput : node.content = joinedOutput
        }
        return ['']
    }

    useEffect(() => {
        if (isPassword) {
            setLines((prev) => [...prev, {
                text: 'password: ',
                type: 'command',
            }]);
        } else {
            setPassword('')
        }
    }, [isPassword])

    useEffect(() => {
        if (failedSudoers > 0 && failedSudoers < maxFailedSudoers) {
            setLines((prev) => [...prev, {
                text: `Número de intentos disponibles: ${maxFailedSudoers - failedSudoers}.`,
                type: 'output',
            }]);
        }
    }, [failedSudoers])

    const handleKeyDown = (e) => {
        if (isSleeping) return;
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isPassword) {
                setLines((prev) => [...prev.slice(0, -1)]);
                if (password === validPassword) {
                    if (sudoCommando.trim() === 'clear') {
                        setLines([]);
                    } else {
                        const outputLines = processCommand(sudoCommando, true).map((out) => ({
                            text: out,
                            type: 'output',
                        }));
                        setLines((prev) => [...prev, ...outputLines]);
                    }
                    setCurrentCommand('');
                    setIsPassword(false)
                    return;
                } else {
                    setFailedSudoers((prev) => prev + 1)
                    if (failedSudoers + 1 >= maxFailedSudoers) {
                        setLines((prev) => [...prev, {
                            text: 'Lo has intentado demasiadas veces. Prueba en un rato.',
                            type: 'output',
                        }]);
                    } else {
                        setLines((prev) => [...prev, {
                            text: 'Credenciales no válidas.',
                            type: 'output',
                        }]);
                    }

                    setCurrentCommand('');
                    setIsPassword(false);
                    return;
                }
            }
            if (currentCommand.trim() !== '') {
                setHistory((prev) => [...prev, currentCommand]);
            }
            setHistoryIndex(-1);
            const commandLine = { text: pathToString(currentPath) + currentPrompt + currentCommand, type: 'command' };
            if (currentCommand.trim() === 'clear') {
                setLines([]);
            } else {
                setLines((prev) => [...prev, commandLine]);
                if ((currentCommand.trim().startsWith("sudo") || currentCommand.trim() == 'su') && !isSudo) {
                    if (currentCommand.replace("sudo", "").trim() == '') {
                        setLines((prev) => [...prev, {
                            text: "Uso: sudo <command>",
                            type: 'output',
                        }]);
                        return;
                    }
                    if (currentCommand.trim() == 'su') {
                        setSudoCommand('wofn1r')
                    } else {
                        setSudoCommand(currentCommand.trim().replace("sudo", ""))
                    }
                    setIsPassword(true)
                    return;
                }
                const outputLines = processCommand(currentCommand, false).map((out) => ({
                    text: out,
                    type: 'output',
                }));
                setLines((prev) => [...prev, ...outputLines]);
            }
            setCurrentCommand('');
        } else if (e.key === 'Backspace') {
            if (currentCommand.length > 0) {
                e.preventDefault();
                setCurrentCommand((prev) => prev.slice(0, -1));
                if (isPassword) {
                    setPassword((prev) => prev.slice(0, -1))
                }
            } else {
                e.preventDefault();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                setHistoryIndex((prev) => {
                    if (prev === -1) {
                        return history.length - 1;
                    }
                    return Math.max(0, prev - 1);
                });
            }

        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                setHistoryIndex((prev) => {
                    if (prev === history.length - 1) {
                        return -1;
                    }
                    return Math.min(history.length - 1, prev + 1);
                });
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            if (isPassword) {
                setCurrentCommand((prev) => prev + '*');
                setPassword((prev) => prev + e.key)
            } else {
                setCurrentCommand((prev) => prev + e.key);
            }
            if (historyIndex !== -1) {
                setHistoryIndex(-1);
            }
        }
    };

    return (
        <div
            id="terminal-container"
            className="terminal-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={terminalRef}
        >
            {lines.map(({ text, type }, i) => (
                <div
                    key={i}
                    id={lines.length - 1 === i ? 'last line' : `${i}line`}
                    className={`terminal-line ${type === 'command' ? 'command-line' : 'output-line'} ${text.includes('password:') ? 'password-line' : ''}`}
                >
                    {text}
                    {isPassword && text.includes('password:') && (
                        <span className="password-command">{currentCommand}</span>
                    )}
                </div>
            ))}
            {!isPassword && !isSleeping && <div className="terminal-line command-line">
                {pathToString(currentPath)}{currentPrompt}{currentCommand}
                <span className="cursor"></span>
            </div>}
        </div>
    );
}

export default InnerTerminal;
