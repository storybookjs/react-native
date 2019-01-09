declare const mock: () => {
    getItem: (key: any) => any;
    setItem: (key: any, value: any) => any;
    removeItem: (key: any) => boolean;
    clear: () => {};
};
