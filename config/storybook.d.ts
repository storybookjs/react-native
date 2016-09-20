declare var module: any; // dangerous

interface StoryDecorator {
    (story: Function): Object;
}

interface Story {
    add (storyName: string, callback: Function): Story;
    addDecorator (decorator: StoryDecorator): Story;
}

export function storiesOf(name: string, module: any): Story;
export function action(name: string, ...params: any[]): Function;
