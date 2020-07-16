import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import ReactSVG from 'react-svg';
import { EntityAttachment } from '../../models/entityAttachment';
import { FileContainer } from '../../models/fileContainer';
import { AttachmentService } from '../../services/attachmentService';
import { IAttachmentsListView } from './attachmentsListViewComponent';

const attachmentTemplate = (context: IAttachmentsListView, attachment: EntityAttachment) => (
    <FlexBox
        key={attachment.nodeId}
        row={'start'}
        className={classnames('attachments-list-view__attachment-item')}
    >
        <figure
            className={classnames('attachments-list-view__attachment-item-icon-wrapper')}
        >
            <ReactSVG
                svgClassName={classnames('attachments-list-view__attachment-item-icon')}
                src={attachment.extensionType.iconPath}
            />
        </figure>
        <FlexBox
            key={attachment.nodeId}
            column={'sb'}
            className={classnames('attachments-list-view__attachment-item-info')}
        >
            <div
                className={classnames('attachments-list-view__attachment-item-name', 'body-2-primary', 'click')}
                onClick={() => context.props.attachmentActions.downloadAttachment(attachment.nodeId)}
            >
                {attachment.name}
            </div>
            <div
                className={classnames('attachments-list-view__attachment-item-size', 'body-1-secondary')}
            >
                {
                    AttachmentService.getSizeText(attachment.size)
                        .toLowerCase()
                }
            </div>
        </FlexBox>
    </FlexBox>
);

const containerTemplate = (context: IAttachmentsListView, container: FileContainer) => (
    <FlexBox
        row={'start'}
        className={classnames('attachments-list-view__attachment-item')}
    >
        <figure
            className={classnames('attachments-list-view__attachment-item-icon-wrapper')}
        >
            <ReactSVG
                svgClassName={classnames('attachments-list-view__attachment-item-icon')}
                src={container.extensionType.iconPath}
            />
        </figure>
        <FlexBox
            column={'sb'}
            className={classnames('attachments-list-view__attachment-item-info')}
        >
            <div
                className={classnames('attachments-list-view__attachment-item-name', 'body-2-primary', 'click')}
                onClick={() => context.props.attachmentActions.downloadAttachment(container.nodeId)}
            >
                {container.nodeName}
            </div>
            <div
                className={classnames('attachments-list-view__attachment-item-size', 'body-1-secondary')}
            >
                {
                    AttachmentService.getSizeText(container.fileSize ? container.fileSize : 0)
                        .toLowerCase()
                }
            </div>
        </FlexBox>
    </FlexBox>
);

const attachmentsListViewTemplate = (context: IAttachmentsListView) => (
    <div
        className={classnames('attachments-list-view-wrapper')}
    >
        {
            !context.props.withoutTitle && !!context.state.attachments.length &&
                !!context.state.containers.length &&
                <div
                    className={classnames('attachments-list-view-wrapper__title subheader-1-primary')}
                >
                    Вложенные файлы
                </div>
        }
        <FlexBox
            rowWrap={'start'}
            className={classnames('attachments-list-view')}
        >
            {
                context.state.attachments.map(attachment => attachmentTemplate(context, attachment))
            }
            {
                context.state.containers.map(container => containerTemplate(context, container))
            }
        </FlexBox>
    </div>
);

export default attachmentsListViewTemplate;
