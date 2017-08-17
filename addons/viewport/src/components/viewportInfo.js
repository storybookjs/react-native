export const viewports = {
    iphone6: {
        name: 'iPhone 6',
        styles: {
            height: '667px',
            width: '375px',
            ...configuredStyles,
        },
    },
    reset: {
        name: 'Reset'
        styles: {
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            margin: '0',
            boxShadow: 'none',
        },
    },
};
