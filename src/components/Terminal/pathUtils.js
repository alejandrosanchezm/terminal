export function findNodeByPath(path, currentPathArray, fileSystemRoot) {
    // Si está vacío, retornamos null
    if (!path) return null;

    let segments;
    let node = fileSystemRoot;

    // Verificamos si la ruta es absoluta
    if (path.startsWith('/')) {
        // El primer segmento es '/', ignoramos o ajustamos
        // segments = ['home','usuario','archivo1.txt'] (ej)
        segments = path.split('/').filter(Boolean);
    } else {
        // Ruta relativa
        // 1) Tomar la ruta actual sin el primer elemento '' (raíz)
        // 2) Unir con path.split('/')
        const currentSegments = currentPathArray.slice(1);
        // p.ej. si currentPathArray = ['', 'home', 'usuario'] => currentSegments = ['home','usuario']
        const relativeSegments = path.split('/').filter(Boolean);
        segments = [...currentSegments, ...relativeSegments];
    }

    // Recorremos los segmentos para ir bajando en la jerarquía
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];

        // Si el nodo actual no es carpeta o no tiene children => no encontramos nada
        if (node.type !== 'folder' || !node.children) {
            return null;
        }

        // Buscamos en los children quien tenga name === seg
        const found = node.children.find((child) => child.name === seg);
        if (!found) {
            return null; // no encontrado
        }
        node = found; // Avanzamos
    }

    return node;
}

export function getFinalPathForCd(basePath, pathArg) {
    // basePath es un array tipo ['', 'home', 'usuario']
    // pathArg es algo como '/home/etc' o '../proyecto'

    // 1. Obtenemos todos los segmentos finales que queremos
    const segments = parsePathSegments(pathArg, basePath);

    // 2. Partimos de la raíz: [''] (indica "/")
    const newPath = [''];

    // 3. Recorremos los segmentos y vamos bajando (o subiendo si "..")
    for (let seg of segments) {
        if (seg === '..') {
            // subir un nivel si se puede
            if (newPath.length > 1) {
                newPath.pop();
            }
        } else {
            // bajar a la carpeta seg
            newPath.push(seg);
        }
    }
    return newPath; // ejemplo: ['', 'home', 'etc']
}

export function parsePathSegments(pathArg, currentPath) {
    if (pathArg.startsWith('/')) {
      // Absoluta
      return pathArg.split('/').filter(Boolean);
    } else {
      // Relativa
      const currentSegments = currentPath.slice(1);
      const relativeSegments = pathArg.split('/').filter(Boolean);
      return [...currentSegments, ...relativeSegments];
    }
  }
  
export function findNodeByPathArray(pathArray, root) {
    // pathArray = ['', 'home','usuario'] => significa "/home/usuario"
    let node = root; // Comenzamos en la raíz del filesystem
    for (let i = 1; i < pathArray.length; i++) {
      const seg = pathArray[i];
      if (node.type !== 'folder' || !node.children) {
        return null;
      }
      const found = node.children.find(child => child.name === seg);
      if (!found) {
        return null;
      }
      node = found;
    }
    return node;
  }