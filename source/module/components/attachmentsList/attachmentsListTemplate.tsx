import { FlexBox } from '@romger/react-flex-layout';
import { RgReactSpinner } from '@romger/react-spinner';
import classnames from 'classnames';
import * as React from 'react';
import ReactSVG from 'react-svg';
import { ToastContainer } from 'react-toastify';
import { FileContainer } from '../../models/fileContainer';
import { AttachmentService } from '../../services/attachmentService';
import ImageViewer from '../imageViewer/imageViewerComponent';
import { AttachmentsListInterface } from './attachmentsListComponent';

const attachmentListTemplate = (context: AttachmentsListInterface) => {
    return (
        <>
            <div
                className={classnames(
                    'attachments-list-wrapper',
                )}
            >
                {
                    !!context.state.selectedContainerIdForPreview &&
                    <ImageViewer
                        attachmentActions={context.props.attachmentActions}
                        allContainerIds={context.allAttachmentIds}
                        fileContainerId={context.state.selectedContainerIdForPreview}
                        onClose={() => context.updateState(null, 'selectedContainerIdForPreview')}
                    />
                }
                <div
                    className={classnames(
                        'attachments-list',
                        {
                            'attachments-list--drag-over': context.dragOverMode,
                        },
                        {
                            'attachments-list--fill-border': !context.attachmentsLength && !context.state.initialLoading && !context.dragOverMode,
                        },
                        {
                            'attachments-list--without-border': context.props.withoutBorder,
                        },
                    )}
                    onMouseEnter={() => context.updateState(true, 'mouseOverModeDropBlock')}
                    onMouseLeave={() => context.updateState(false, 'mouseOverModeDropBlock')}
                >
                    {
                        !!context.attachmentsLength &&
                        <FlexBox
                            rowWrap="start"
                            className={classnames(
                                'attachments-list__containers',
                                {
                                    'attachments-list__containers--single-attachment': !context.allowMultipleLoad,
                                },
                            )}
                        >
                            {
                                context.state.attachments.map((attachment: FileContainer, index: number) => (
                                    <FlexBox
                                        key={index}
                                        column="start"
                                        className={classnames(
                                            'attachments-list__container-item',
                                        )}
                                    >
                                        {
                                            context.isShowImageThumbnail(attachment.nodeId) &&
                                            <FlexBox
                                                row={'ctr'}
                                                className={classnames(
                                                    'attachments-list__image-container-thumbnail-wrapper',
                                                )}
                                            >
                                                <img
                                                    className={classnames(
                                                        'attachments-list__image-container-thumbnail',
                                                    )}
                                                    src={context.props.attachmentActions?.getLinkAttachment((attachment.nodeId))}
                                                />
                                            </FlexBox>
                                        }
                                        {
                                            !context.isShowImageThumbnail(attachment.nodeId) &&
                                            <>
                                                <div
                                                    ref={(ref: HTMLDivElement) => context.ellipsizeTextElement(ref)}
                                                    className={classnames('attachments-list__container-file-name')}
                                                >
                                                    {attachment.nodeName}
                                                </div>
                                                <FlexBox
                                                    row="start center"
                                                    className={classnames('attachments-list__container-file-format', 'label-primary')}
                                                >
                                                    {
                                                        attachment.extensionType ? attachment.extensionType.extension.toUpperCase() : ''
                                                    }
                                                </FlexBox>
                                            </>
                                        }
                                        {
                                            !context.state.loadingAttachmentsIds.get(attachment.nodeId) &&
                                            <FlexBox
                                                row="start"
                                                className={classnames('attachments-list__container-item-buttons')}
                                            >
                                                {
                                                    !context.props.hideRemoveAttachmentButton &&
                                                    <FlexBox
                                                        row="ctr"
                                                        node="button"
                                                        className={classnames('attachments-list__container-item-button')}
                                                        onClick={() => context.deleteAttachment(attachment.nodeId)}
                                                    >
                                                        <i
                                                            className={classnames('material-icons')}
                                                        >
                                                            delete_outline
                                                        </i>
                                                    </FlexBox>
                                                }
                                                <FlexBox
                                                    row="ctr"
                                                    node="button"
                                                    className={classnames(
                                                        'attachments-list__container-item-button',
                                                    )}
                                                    onClick={() => context.downloadAttachment(attachment.nodeId)}
                                                >
                                                    <i
                                                        className={classnames('material-icons')}
                                                    >
                                                        get_app
                                                    </i>
                                                </FlexBox>
                                            </FlexBox>
                                        }
                                        {
                                            !!context.state.loadingAttachmentsIds.get(attachment.nodeId) &&
                                            <FlexBox
                                                row="ctr"
                                                className={classnames('attachments-list__loading-fader')}
                                            >
                                                <div
                                                    className={classnames('attachments-list__loading-fader-circle')}
                                                    onClick={() => context.cancelLoadingAttachment(attachment.nodeId)}
                                                >
                                                    <svg>
                                                        <path
                                                            fill="none"
                                                            stroke="white"
                                                            strokeWidth="3"
                                                            d={context.getArcForElement(attachment.nodeId)}
                                                        />
                                                    </svg>
                                                    <i
                                                        className={classnames('material-icons', 'attachments-list__loading-fader-icon')}
                                                    >
                                                        close
                                                    </i>
                                                </div>
                                            </FlexBox>
                                        }
                                        <div
                                            className={classnames('attachments-list__hover-fader', 'click')}
                                            onClick={
                                                () => attachment.extensionType && attachment.extensionType.isImage && !context.isContainerLoading(attachment.nodeId)
                                                    ? context.updateState(attachment.nodeId, 'selectedContainerIdForPreview')
                                                    : null
                                            }
                                        />
                                    </FlexBox>
                                ))
                            }
                            {
                                context.state.multiPartFiles.map((file, index) => (
                                    <FlexBox
                                        key={index}
                                        column="start"
                                        className={classnames(
                                            'attachments-list__container-item',
                                        )}
                                    >
                                        <>
                                            <div
                                                ref={(ref: HTMLDivElement) => context.ellipsizeTextElement(ref)}
                                                className={classnames('attachments-list__container-file-name')}
                                            >
                                                {file.name}
                                            </div>
                                            <FlexBox
                                                row="start center"
                                                className={classnames('attachments-list__container-file-format', 'label-primary')}
                                            >
                                                {
                                                    AttachmentService.getFileExtensionFromFullName(file.name) ??
                                                    AttachmentService.getFileExtensionFromMimeType(file.type) ??
                                                    ''
                                                }
                                            </FlexBox>
                                        </>
                                        <FlexBox
                                            row="start"
                                            className={classnames('attachments-list__container-item-buttons')}
                                        >
                                            {
                                                !context.props.hideRemoveAttachmentButton &&
                                                <FlexBox
                                                    row="ctr"
                                                    node="button"
                                                    className={classnames('attachments-list__container-item-button')}
                                                    onClick={() => context.deleteMultipartFile(index)}
                                                >
                                                    <i
                                                        className={classnames('material-icons')}
                                                    >
                                                        delete_outline
                                                    </i>
                                                </FlexBox>
                                            }
                                        </FlexBox>
                                    </FlexBox>
                                ))
                            }
                            {
                                !context.props.hideLoadMoreBlock && (!context.props.availableAttachmentsCount || context.props.availableAttachmentsCount > context.attachmentsLength) &&
                                <FlexBox
                                    column="ctr"
                                    className={classnames('attachments-list__container-item', 'attachments-list__container-item--add-new')}
                                    onClick={() => context.openFileSelectDialog()}
                                >
                                    <ReactSVG
                                        svgClassName={classnames('attachments-list__empty-block-icon')}
                                        src={'assets/images/svg/attachment-upload.svg'}
                                    />
                                    <div
                                        className={classnames('attachments-list__empty-block-text', 'caption-primary')}
                                    >
                                        Загрузить ещё...
                                    </div>
                                </FlexBox>
                            }
                        </FlexBox>
                    }
                    {
                        !context.attachmentsLength &&
                        !context.props.hideEmptyBlock &&
                        <div
                            className={classnames('attachments-list__empty-block')}
                        >
                            <FlexBox
                                column="start ctr"
                                className={classnames('attachments-list__empty-block-content')}
                                onClick={() => context.openFileSelectDialog()}
                            >
                                <ReactSVG
                                    svgClassName={classnames('attachments-list__empty-block-icon')}
                                    src={'assets/images/svg/attachment-upload.svg'}
                                />
                                <div
                                    className={classnames(
                                        'attachments-list__empty-block-text',
                                        'caption-primary',
                                    )}
                                >
                                    {'Перетащите файлы или '}
                                    <a
                                        className={classnames('attachments-list__add-file-link')}
                                    >
                                        выберите
                                    </a>
                                </div>
                            </FlexBox>
                        </div>
                    }
                    <div
                        className={classnames('attachments-list__fader')}
                    />
                    {
                        context.state.initialLoading &&
                        <FlexBox
                            row="ctr"
                            className={classnames('attachments-list__initial-loading-fader')}
                        >
                            <RgReactSpinner
                                loading={true}
                                width={36}
                                height={36}
                                color="#65A3BE"
                                inline={true}
                            />
                        </FlexBox>
                    }
                    <div
                        ref={(ref: HTMLElement | null) => context.dropFilesBlock = ref}
                        className={classnames(
                            'attachments-list__drop-files-block',
                            {
                                'attachments-list__drop-files-block--hidden': !context.showDropBlock,
                            },
                        )}
                    />
                    <FlexBox
                        row="ctr start"
                        className={classnames('attachments-list__dragndrop-text-wrapper')}
                    >
                        <div
                            className={classnames('attachments-list__dragndrop-text')}
                        >
                            {context.props.dragNDropTitle ? context.props.dragNDropTitle : 'Перетащите файлы, чтобы загрузить их'}
                        </div>
                    </FlexBox>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        multiple={context.allowMultipleLoad}
                        accept={context.inputAcceptAttribute}
                        ref={(ref: HTMLInputElement | null) => context.inputBlock = ref}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => context.onInputSelectFiles(e)}
                    />
                </div>
                {
                    context.showWarningLabel &&
                    !context.props.hideWarningLabel &&
                    <div
                        className={classnames(
                            'attachments-list__warning-label',
                            'body-1-primary',
                        )}
                    >
                        {context.getWarningLabelText()}
                    </div>
                }
            </div>
            {
                !!context.props.showIncludeToast &&
                <ToastContainer
                    toastClassName="global-toast"
                    position={'bottom'}
                />
            }
        </>
    );
};

export default attachmentListTemplate;
