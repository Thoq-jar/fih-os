interface File {
    name: string;
    content: string;
    createdAt: Date;
    modifiedAt: Date;
}

interface Directory {
    name: string;
    createdAt: Date;
    modifiedAt: Date;
}

type FileSystemNode = File | Directory;

const FILESYSTEM_KEY = 'fih-os-filesystem';

const getFileSystem = (): Record<string, FileSystemNode> => {
    const storedFs = localStorage.getItem(FILESYSTEM_KEY);
    if(storedFs) {
        const parsed = JSON.parse(storedFs);
        for(const path in parsed) {
            parsed[path].createdAt = new Date(parsed[path].createdAt);
            parsed[path].modifiedAt = new Date(parsed[path].modifiedAt);
        }
        return parsed;
    }
    return {
        '/': {name: '/', createdAt: new Date(), modifiedAt: new Date()} as Directory,
        '/home': {name: 'home', createdAt: new Date(), modifiedAt: new Date()} as Directory,
        '/home/user': {name: 'user', createdAt: new Date(), modifiedAt: new Date()} as Directory,
        '/home/user/fih.txt': {
            name: 'fih.txt',
            content: 'fih',
            createdAt: new Date(),
            modifiedAt: new Date(),
        } as File,
    };
};

const saveFileSystem = (fs: Record<string, FileSystemNode>) => {
    localStorage.setItem(FILESYSTEM_KEY, JSON.stringify(fs));
};

export const readdir = (path: string): string[] => {
    const fs = getFileSystem();
    const normalizedPath = path === '/' ? '/' : `${path}/`;
    const entries = new Set<string>();

    for(const p in fs) {
        if(p.startsWith(normalizedPath) && p !== normalizedPath) {
            const relativePath = p.substring(normalizedPath.length);
            const parts = relativePath.split('/');
            entries.add(parts[0]);
        }
    }
    return Array.from(entries);
};

export const writeFile = (path: string, content: string): void => {
    const fs = getFileSystem();
    const now = new Date();
    if(fs[path] && 'content' in fs[path]) {
        (fs[path] as File).content = content;
        fs[path].modifiedAt = now;
    } else {
        const name = path.split('/').pop() || '';
        fs[path] = {name, content, createdAt: now, modifiedAt: now};
    }
    saveFileSystem(fs);
};

export const readFile = (path: string): string => {
    const fs = getFileSystem();
    const node = fs[path];
    if(node && 'content' in node) {
        return (node as File).content;
    }
    throw new Error(`File not found: ${path}`);
};

export const mkdir = (path: string): void => {
    const fs = getFileSystem();
    if(fs[path]) {
        throw new Error(`File or directory already exists: ${path}`);
    }
    const now = new Date();
    const name = path.split('/').pop() || '';
    fs[path] = {name, createdAt: now, modifiedAt: now} as Directory;
    saveFileSystem(fs);
};

export const touch = (path: string): void => {
    const fs = getFileSystem();
    if(!fs[path]) {
        writeFile(path, '');
    } else {
        fs[path].modifiedAt = new Date();
        saveFileSystem(fs);
    }
};

export const rm = (path: string): void => {
    const fs = getFileSystem();
    if(!fs[path]) {
        throw new Error(`File or directory not found: ${path}`);
    }
    if(!('content' in fs[path])) {
        for(const p in fs) {
            if(p.startsWith(`${path}/`)) {
                delete fs[p];
            }
        }
    }
    delete fs[path];
    saveFileSystem(fs);
};

export const exists = (path: string): boolean => {
    const fs = getFileSystem();
    return !!fs[path];
};

export const isDirectory = (path: string): boolean => {
    const fs = getFileSystem();
    const node = fs[path];
    return node && !('content' in node);
};