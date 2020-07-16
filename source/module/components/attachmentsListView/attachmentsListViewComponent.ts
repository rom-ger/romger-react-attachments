import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { isEqual } from 'lodash';
import { IAttachmentActions } from '../../interfaces/IAttachmentActions';
import { EntityAttachment } from '../../models/entityAttachment';
import { FileContainer } from '../../models/fileContainer';
import attachmentsListViewTemplate from './attachmentsListViewTemplate';

interface IAttachmentsListViewProps {
    attachmentActions: IAttachmentActions;
    attachments?: EntityAttachment[];
    containers?: FileContainer[];
    attachmentsIds?: string[];
    withoutTitle?: boolean;
    showImage?: boolean;
}

interface IAttachmentsListViewState {
    attachments: EntityAttachment[];
    containers: FileContainer[];
}

export interface IAttachmentsListView extends RgReactBaseComponentInterface {
    props: IAttachmentsListViewProps;
    state: IAttachmentsListViewState;
}

export default class AttachmentsListView extends RgReactBaseComponent<IAttachmentsListViewProps, IAttachmentsListViewState> implements IAttachmentsListView {
    state: IAttachmentsListViewState = {
        attachments: [],
        containers: [],
    };

    componentDidMount() {
        if (this.props.attachments ||
            this.props.containers ||
            this.props.attachmentsIds) {
            this.initComponent(this.props);
        }
    }

    componentWillReceiveProps(nextProps: Readonly<IAttachmentsListViewProps>): void {
        let isEqualAttachments = !nextProps.attachments && nextProps.attachments === this.props.attachments
            ? true
            : !isEqual(
                this.props.attachments ? this.props.attachments.map(attachment => attachment.nodeId) : [],
                nextProps.attachments ? nextProps.attachments.map(attachment => attachment.nodeId) : [],
            );

        let isEqualContainers = !nextProps.containers && nextProps.containers === this.props.containers
            ? true
            : !isEqual(
                this.props.containers ? this.props.containers.map(container => container.nodeId) : [],
                nextProps.containers ? nextProps.containers.map(container => container.nodeId) : [],
            );

        if (
            !isEqualAttachments ||
            !isEqualContainers ||
            !isEqual(this.props.attachmentsIds, nextProps.attachmentsIds)
        ) {
            this.initComponent(nextProps);
        }
    }

    /**
     * Инициализировать компонент
     * @param props
     */
    initComponent(props = this.props) {
        if (props.attachments) {
            let filteredAttachments = props.attachments.filter(attachment => !!this.props.showImage || (!!attachment.extensionType && !attachment.extensionType.isImage));
            this.setState({ attachments: filteredAttachments });
            return;
        }

        if (props.containers) {
            let filteredContainers = props.containers.filter(container => !!this.props.showImage || (!!container.extensionType && !container.extensionType.isImage));
            this.setState({ containers: filteredContainers });
            return;
        }

        if (props.attachmentsIds) {
            this.props.attachmentActions.getAllInfo(props.attachmentsIds)
                .then(res => this.setState({ containers: res.items.filter(container => !!this.props.showImage || (!!container.extensionType && !container.extensionType.isImage)) }));
        }
    }

    render(): false | JSX.Element {
        return attachmentsListViewTemplate(this);
    }
}
