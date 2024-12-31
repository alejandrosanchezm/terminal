export const fileSystem = {
    name: '/',
    type: 'folder',
    children: [
        {
            name: 'home',
            type: 'folder',
            children: []
        },
        {
            name: 'users',
            type: 'folder',
            children: [
                {
                    name: 'alexsanchez',
                    type: 'folder',
                    children: [
                        {
                            name: 'notas.txt',
                            type: 'file',
                            content: 'Lista de tareas para la próxima semana:\n-A. '
                        },
                        {
                            name: 'proyectos',
                            type: 'folder',
                            children: [
                                {
                                    name: 'terminal.txt',
                                    type: 'file',
                                    content: 'Proyecto de una terminal a modo de página personal\n\n¿Qué te parece?'
                                },
                                {
                                    name: 'obsly.json',
                                    type: 'file',
                                    content: '{"Nombre": "Obsly", "Descripción":"Herramienta de Observabilidad."}'
                                },
                                {
                                    name: '.config',
                                    type: 'file',
                                    content: 'password=validPassword'
                                },
                            ]
                        },
                        {
                            name: 'Desktop',
                            type: 'folder',
                            children: []
                        }
                    ],
                },
            ],
        },
        {
            name: 'etc',
            type: 'folder',
            children: [
                {
                    name: 'config.cfg',
                    type: 'file',
                    content: 'config=1\ntheme=dark'
                },
            ],
        },
        {
            name: 'readme.md',
            type: 'file',
            content: '# Sistema de gestión de Recursos Humanos\nOrganización de:\n - Proyectos\n - CVs\n - Horarios\n - Calendario.'
        },
    ],
};
