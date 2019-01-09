import * as React from 'react';
import * as PropTypes from 'prop-types';
import { API } from './shared';
interface Props {
    active: boolean;
    api: API;
}
interface NotesPanelState {
    value?: string;
}
export default class NotesPanel extends React.Component<Props, NotesPanelState> {
    static propTypes: {
        active: PropTypes.Validator<boolean>;
        api: PropTypes.Validator<PropTypes.InferProps<{
            on: PropTypes.Requireable<(...args: any[]) => any>;
            off: PropTypes.Requireable<(...args: any[]) => any>;
            emit: PropTypes.Requireable<(...args: any[]) => any>;
            getParameters: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
    };
    readonly state: NotesPanelState;
    mounted: boolean;
    options: {
        overrides: {
            code: (props: any) => JSX.Element;
        };
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    onStoryChange: (id: string) => void;
    render(): JSX.Element;
}
export {};
