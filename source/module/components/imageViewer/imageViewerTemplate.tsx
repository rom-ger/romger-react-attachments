import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import ReactSVG from 'react-svg';
import { ImageViewerInterface } from './imageViewerComponent';

const imageViewerTemplate = (context: ImageViewerInterface) => {
    return (
        <FlexBox
            column={'stretch'}
            className={classnames(
                'image-viewer',
            )}
        >
            <FlexBox
                row={'space-between center'}
                className={classnames(
                    'image-viewer__header',
                )}
            >
                <div
                    className={classnames(
                        'image-viewer__container-name',
                        'body-2-primary',
                    )}
                >
                    {!!context.state.fileContainer && context.state.fileContainer.nodeName}
                </div>
                <FlexBox
                    row={'start ctr'}
                    className={classnames(
                        'image-viewer__icons',
                    )}
                >
                    <i
                        className={classnames(
                            'image-viewer__icon',
                            'material-icons',
                            'click',
                        )}
                        onClick={() => context.downloadImage()}
                    >
                        get_app
                    </i>
                    <i
                        className={classnames(
                            'image-viewer__icon',
                            'material-icons',
                            'click',
                        )}
                        onClick={() => context.props.onClose()}
                    >
                        close
                    </i>
                </FlexBox>
            </FlexBox>
            <FlexBox
                row={'space-between center'}
                className={classnames(
                    'image-viewer__content-wrapper',
                )}
                onClick={() => context.props.onClose()}
            >
                <img
                    className={classnames(
                        'image-viewer__content',
                    )}
                    src={context.getImageSrc()}
                    onClick={e => e.stopPropagation()}
                />
            </FlexBox>
            {
                !!context.showPrevArrow() &&
                <FlexBox
                    row={'ctr'}
                    className={classnames('image-viewer__prev-arrow', 'click')}
                    onClick={() => context.goToPrev()}
                >
                    <ReactSVG
                        svgClassName={classnames('image-viewer__prev-arrow-icon')}
                        src={'assets/images/svg/ic_arrow_right_24px.svg'}
                    />
                </FlexBox>
            }
            {
                !!context.showNextArrow() &&
                <FlexBox
                    row={'ctr'}
                    className={classnames('image-viewer__next-arrow', 'click')}
                    onClick={() => context.goToNext()}
                >
                    <ReactSVG
                        svgClassName={classnames('image-viewer__next-arrow-icon')}
                        src={'assets/images/svg/ic_arrow_right_24px.svg'}
                    />
                </FlexBox>
            }
        </FlexBox>
    );
};

export default imageViewerTemplate;
