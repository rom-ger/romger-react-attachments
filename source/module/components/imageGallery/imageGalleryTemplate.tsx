import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import ReactSVG from 'react-svg';
import ImageViewer from '../imageViewer/imageViewerComponent';
import { IImageGallery } from './imageGalleryComponent';

const imageItemTemplate = (context: IImageGallery, imageId: string) => (
    <div
        key={imageId}
        id={imageId}
        ref={ref => ref && context.refSlides.set(imageId, ref)}
        className={classnames(
            'image-gallery__image-block',
            {
                'image-gallery__image-block--active': imageId === context.state.currentSlideId,
            },
        )}
    >
        <img
            className={classnames(
                'image-gallery__image',
                {
                    'image-gallery__image--active-blur': context.props.showBackgroundBlur,
                },
                {
                    click: context.props.enableImagePreview,
                },
            )}
            src={context.getImageSrc(imageId)}
            onClick={() => context.openImagePreview(imageId)}
        />
    </div>
);

const dotItemTemplate = (context: IImageGallery, imageId: string) => (
    <div
        key={imageId}
        className={classnames(
            'image-gallery__dot',
            'click',
            {
                'image-gallery__dot--active': imageId === context.state.currentSlideId,
            },
        )}
        onClick={() => context.dotsClickHandler(imageId)}
    />
);

const imageGalleryTemplate = (context: IImageGallery) => (
    <React.Fragment>
        {
            !context.galleryIsEmpty &&
            <div
                className={classnames('image-gallery')}
            >
                {
                    (context.state.imagePreviewId || context.state.imagePreviewUrl) &&
                    <ImageViewer
                        attachmentActions={context.props.attachmentActions}
                        fileContainerId={context.state.imagePreviewId}
                        allContainerIds={context.allAttachmentIds}
                        url={context.state.imagePreviewUrl}
                        onClose={() => context.closeImagePreview()}
                    />
                }
                <div
                    ref={node => (context.refSliderList = node)}
                    className={classnames('image-gallery__images-list')}
                >
                    {
                        context.props.showBackgroundBlur &&
                        <div
                            ref={ref => context.refImageBackground = ref}
                            className={classnames('image-gallery__image-block-background')}
                        />
                    }
                    {
                        context.state.containers.map(fileContainer => imageItemTemplate(context, fileContainer.nodeId))
                    }
                    {
                        context.state.attachments.map(imageAttachment => imageItemTemplate(context, imageAttachment.nodeId))
                    }
                    {
                        context.props.imagesUrl &&
                        context.props.imagesUrl.map(
                            imageUrl => imageItemTemplate(context, context.getImageByUrlElementId(imageUrl)),
                        )
                    }
                </div>
                {
                    context.props.enableDotsControl &&
                    context.showDotsAndArrows &&
                    <FlexBox
                        row={'ctr'}
                        className={classnames('image-gallery__dots')}
                    >
                        {
                            context.state.containers.map(fileContainer => dotItemTemplate(context, fileContainer.nodeId))
                        }
                        {
                            context.state.attachments.map(imageAttachment => dotItemTemplate(context, imageAttachment.nodeId))
                        }
                        {
                            context.props.imagesUrl &&
                            context.props.imagesUrl.map(
                                imageUrl => dotItemTemplate(context, context.getImageByUrlElementId(imageUrl)),
                            )
                        }
                    </FlexBox>
                }
                {
                    context.props.enableArrowsControl &&
                    context.showDotsAndArrows &&
                    <FlexBox
                        row={'ctr'}
                        className={classnames('image-gallery__prev-arrow', 'click')}
                        onClick={() => context.onPrevArrowClick()}
                    >
                        <ReactSVG
                            svgClassName={classnames('image-gallery__prev-arrow-icon')}
                            src={'assets/images/svg/ic_arrow_right_24px.svg'}
                        />
                    </FlexBox>
                }
                {
                    context.props.enableArrowsControl &&
                    context.showDotsAndArrows &&
                    <FlexBox
                        row={'ctr'}
                        className={classnames('image-gallery__next-arrow', 'click')}
                        onClick={() => context.onNextArrowClick()}
                    >
                        <ReactSVG
                            svgClassName={classnames('image-gallery__next-arrow-icon')}
                            src={'assets/images/svg/ic_arrow_right_24px.svg'}
                        />
                    </FlexBox>
                }
            </div>
        }
    </React.Fragment>
);

export default imageGalleryTemplate;
