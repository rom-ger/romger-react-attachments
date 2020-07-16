import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { isEqual } from 'lodash';
import { IAttachmentActions } from '../../interfaces/IAttachmentActions';
import { EntityAttachment } from '../../models/entityAttachment';
import { FileContainer } from '../../models/fileContainer';
import imageGalleryTemplate from './imageGalleryTemplate';

interface IImageGalleryProps {
    attachmentActions?: IAttachmentActions;
    attachments?: EntityAttachment[];
    containers?: FileContainer[];
    attachmentsIds?: string[];
    imagesUrl?: string[];
    enableDotsControl?: boolean;
    enableArrowsControl?: boolean;
    showBackgroundBlur?: boolean;
    imageChangeInterval?: number;
    enableImagePreview?: boolean;
}

interface IImageGalleryState {
    containers: FileContainer[];
    attachments: EntityAttachment[];
    currentSlideId: string | null;
    currentPointId: string | null;
    imagePreviewId: string | null;
    imagePreviewUrl: string | null;
    isScrollingNow: boolean;
}

export interface IImageGallery extends RgReactBaseComponentInterface {
    state: IImageGalleryState;
    props: IImageGalleryProps;
    refSlides: Map<string, HTMLDivElement>;
    refSliderList: HTMLDivElement | null;
    refImageBackground: HTMLDivElement | null;
    galleryIsEmpty: boolean;
    showDotsAndArrows: boolean;

    allAttachmentIds: string[];

    dotsClickHandler(slideId: string | null): void;

    onNextArrowClick(): void;

    onPrevArrowClick(): void;

    getImageByUrlElementId(imageId: string | number): string;

    getImageSrc(imageId: string): string;

    openImagePreview(imageId: string): void;

    closeImagePreview(): void;
}

export default class ImageGallery extends RgReactBaseComponent<IImageGalleryProps, IImageGalleryState> implements IImageGallery {
    state: IImageGalleryState = {
        containers: [],
        attachments: [],
        currentSlideId: null,
        currentPointId: null,
        imagePreviewId: null,
        imagePreviewUrl: null,
        isScrollingNow: false,
    };

    refSlides: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();
    refSliderList: HTMLDivElement | null = null;
    refImageBackground: HTMLDivElement | null = null;
    imageByUrlPrefix: string = 'image-by-url-';
    changeImageInterval: number | null = null;

    componentDidMount(): void {
        this.initComponent();
    }

    componentWillReceiveProps(nextProps: Readonly<IImageGalleryProps>): void {
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

    get allAttachmentIds() {
        if (!!this.state.attachments && !!this.state.attachments.length) {
            return this.state.attachments.filter((el: EntityAttachment) =>  !!el.extensionType && !!el.extensionType.isImage)
                                         .map((el: EntityAttachment) => el.nodeId);
        }
        if (!!this.state.containers && !!this.state.containers.length) {
            return this.state.containers.filter((el: FileContainer) =>  !!el.extensionType && !!el.extensionType.isImage)
                                        .map((el: FileContainer) => el.nodeId);
        }
        return [];
    }

    get galleryIsEmpty() {
        return !this.state.attachments.length && !this.state.containers.length && !this.props.imagesUrl;
    }

    get showDotsAndArrows() {
        let totalCountOfImages = this.state.attachments.length + this.state.containers.length + (this.props.imagesUrl ? this.props.imagesUrl.length : 0);
        return totalCountOfImages > 1;
    }

    /**
     * Поменять фоновую картинку на слайдере
     * @param imageId
     */
    setBackgroundImage(imageId: string) {
        if (this.refImageBackground) {
            this.refImageBackground.style.backgroundImage = `url(${this.getImageSrc(imageId)})`;
        }
    }

    /**
     * Иниуиализировать компонент
     */
    initComponent(props = this.props) {
        if (props.attachments && props.attachments.length) {
            let processedAttachments = props.attachments.filter(attachment => !!attachment.extensionType && attachment.extensionType && attachment.extensionType.isImage);

            if (!processedAttachments.length) {
                return;
            }

            let imageId = processedAttachments[0].nodeId;

            this.setState(
                {
                    attachments: processedAttachments,
                    currentSlideId: imageId,
                    currentPointId: imageId,
                },
                () => {
                    this.setBackgroundImage(imageId);
                    this.startChangeImageInterval();
                },
            );
            return;
        }

        if (props.containers && props.containers.length) {
            let processedContainers = props.containers.filter(container => !!container.extensionType && container.extensionType && container.extensionType.isImage);

            if (!processedContainers.length) {
                return;
            }

            let imageId = processedContainers[0].nodeId;

            this.setState(
                {
                    containers: processedContainers,
                    currentSlideId: imageId,
                    currentPointId: imageId,
                },
                () => {
                    this.setBackgroundImage(imageId);
                    this.startChangeImageInterval();
                },
            );
            return;
        }

        if (props.attachmentsIds && props.attachmentsIds.length) {
            this.loadAttachmentsContainers(props.attachmentsIds)
                .then((res) => {
                    if (!res) {
                        return;
                    }

                    let processedContainers = res
                        ? res.items.filter(container => !!container.extensionType && container.extensionType && container.extensionType.isImage)
                        : [];

                    if (!processedContainers.length) {
                        return;
                    }

                    let imageId = processedContainers[0].nodeId;

                    this.setState(
                        {
                            containers: processedContainers,
                            currentSlideId: imageId,
                            currentPointId: imageId,
                        },
                        () => {
                            this.setBackgroundImage(imageId);
                            this.startChangeImageInterval();
                        },
                    );
                });
        }

        if (props.imagesUrl && props.imagesUrl.length) {
            let imageId = this.getImageByUrlElementId(props.imagesUrl[0]);

            this.setState(
                {
                    currentSlideId: imageId,
                    currentPointId: imageId,
                },
                () => {
                    this.setBackgroundImage(imageId);
                    this.startChangeImageInterval();
                },
            );

            return;
        }
    }

    /**
     * Находим информацию по направлению движения слайдера
     * @param {*} arrayRefs
     * @param {*} slideId
     */
    findDirectionInfo(arrayRefs: HTMLDivElement[], slideId: string) {
        let direction = 0;
        let startIndex = -1;
        let endIndex = -1;
        arrayRefs.forEach((el, index) => {
            if (el.id === this.state.currentSlideId && direction === 0) {
                direction = 1;
                startIndex = index;
            }
            if (el.id === slideId && direction === 0) {
                direction = -1;
                startIndex = index;
            }
            if ((el.id === slideId && direction === 1) || (direction === -1 && el.id === this.state.currentSlideId)) {
                endIndex = index;
            }
        });

        let rightDir = endIndex - startIndex;
        let leftDir = startIndex + (arrayRefs.length - endIndex);
        let reverse = leftDir < rightDir;
        let length = reverse ? leftDir : rightDir;
        if (reverse) {
            direction = direction === -1 ? 1 : -1;
        }
        return {
            startIndex,
            endIndex,
            direction,
            reverse,
            length,
        };
    }

    /**
     * Добавить элемент в массив изменяемых элементов
     */
    addElementToArrayModifyRefs(direction: number, number: number, length: number, el: HTMLDivElement, array: HTMLDivElement[]) {
        if (!this.refSliderList) {
            return array;
        }
        let offsetLeft = (direction > 0 ? number : length - number) * this.refSliderList.clientWidth * (direction < 0 ? -1 : 1);
        el.style.left = `${offsetLeft}px`;
        el.setAttribute('wsPositionLeft', offsetLeft.toString());
        array.push(el);
        return array;
    }

    /**
     * Создаём массив, где будут лежать все элементы, которые нам надо перемещать
     * @param arrayRefs
     * @param direction
     * @param startIndex
     * @param endIndex
     * @param length
     * @param reverse
     */
    createArrayModifyRefs(arrayRefs: HTMLDivElement[], direction: number, startIndex: number, endIndex: number, length: number, reverse: boolean) {
        let arrayModifyRefs: HTMLDivElement[] = [];
        let number = 0;
        if (!reverse) {
            for (let i = startIndex; i <= endIndex; i++) {
                arrayModifyRefs = this.addElementToArrayModifyRefs(direction, number, length, arrayRefs[i], arrayModifyRefs);
                number++;
            }
        } else {
            for (let i = endIndex; i < arrayRefs.length; i++) {
                arrayModifyRefs = this.addElementToArrayModifyRefs(direction, number, length, arrayRefs[i], arrayModifyRefs);
                number++;
            }
            for (let i = 0; i <= startIndex; i++) {
                arrayModifyRefs = this.addElementToArrayModifyRefs(direction, number, length, arrayRefs[i], arrayModifyRefs);
                number++;
            }
        }
        return arrayModifyRefs;
    }

    /**
     * Запускаем скрол
     * @param array
     * @param direction
     * @param slideId
     */
    startScroll(array: HTMLDivElement[], direction: number, slideId: string) {
        if (!this.refSliderList) {
            return;
        }
        let allHeight = this.refSliderList.clientWidth * (array.length - 1);
        let timeout = 300;
        array.forEach((el) => {
            let wsPositionLeftAttributeValue = el.getAttribute('wsPositionLeft');
            let wsPositionLeft = wsPositionLeftAttributeValue
                ? parseInt(wsPositionLeftAttributeValue, this.dex)
                : 0;
            let newLeft = direction > 0 ? wsPositionLeft - allHeight : wsPositionLeft + allHeight;
            el.style.transitionProperty = 'left';
            el.style.transitionDuration = `${timeout}ms`;
            el.style.transitionTimingFunction = 'cubic-bezier(0, 0, 1, 1)';
            el.style.left = `${newLeft}px`;
            el.setAttribute('wsPositionLeft', newLeft.toString());
        });

        if (this.refImageBackground) {
            this.refImageBackground.style.transitionDuration = '0ms';
            this.refImageBackground.style.opacity = '0';
            this.refImageBackground.style.backgroundSize = '100% 100%';
        }

        window.setTimeout(
            () => {
                this.setState(
                    {
                        currentSlideId: slideId,
                        isScrollingNow: false,
                    },
                    () => {
                        this.clearAllLeftStyle(array);
                        this.setBackgroundImage(slideId);

                        if (this.refImageBackground) {
                            this.refImageBackground.style.transitionDuration = `${timeout}ms`;
                            this.refImageBackground.style.opacity = '1';
                        }
                    },
                );
            },
            timeout,
        );
    }

    /**
     * Проставить у всех элементов дефолтное значение left
     * @param {*} arrayRefs
     */
    clearAllLeftStyle(arrayRefs: HTMLDivElement[]) {
        arrayRefs.forEach((el) => {
            el.style.transitionProperty = 'none';
            el.style.transitionDuration = 'inherit';
            if (el.id !== this.state.currentSlideId) {
                el.style.left = '100%';
            } else {
                el.style.left = '0';
            }
        });
    }

    /**
     * Перейти к слайду
     * @param {*} slideId
     */
    goToSlide(slideId: string) {
        if (this.state.isScrollingNow) {
            return;
        }

        let arrayRefs = Array.from(this.refSlides.values());
        let infoDirection = this.findDirectionInfo(arrayRefs, slideId);
        let arrayModifyRefs = this.createArrayModifyRefs(arrayRefs, infoDirection.direction, infoDirection.startIndex, infoDirection.endIndex, infoDirection.length, infoDirection.reverse);
        this.setState({ isScrollingNow: true }, () => this.startScroll(arrayModifyRefs, infoDirection.direction, slideId));
    }

    /**
     * Что делать при клике на точку
     * @param {*} slideId
     */
    dotsClickHandler(slideId: string | null) {
        if (slideId === this.state.currentSlideId || !slideId) {
            return;
        }
        this.stopChangeImageInterval();
        this.setState(
            {
                currentPointId: slideId,
            },
            () => {
                this.goToSlide(slideId);
                this.startChangeImageInterval();
            },
        );
    }

    /**
     * Получить информацию о контейнерах вложений
     * @param ids
     */
    loadAttachmentsContainers(ids: string[]) {
        return this.props.attachmentActions
            ? this.props.attachmentActions.getAllInfo(ids)
            : Promise.reject();
    }

    /**
     * Клик по стрелке перехода на следующее изображение
     */
    onNextArrowClick(): void {
        this.stopChangeImageInterval();
        this.goToNextSlide();
        this.startChangeImageInterval();
    }

    /**
     * Переход на следующее изображение
     */
    goToNextSlide() {
        let allImagesIds = this.getAllImagesIds();

        let currentImageIndex = allImagesIds.findIndex(imageId => imageId === this.state.currentSlideId);

        if (currentImageIndex === -1) {
            return;
        }

        let nextImageIndex = currentImageIndex + 1;
        nextImageIndex = nextImageIndex > allImagesIds.length - 1
            ? nextImageIndex - allImagesIds.length
            : nextImageIndex;

        this.goToSlide(allImagesIds[nextImageIndex]);
    }

    /**
     * Клик по стрелке перехода на предыдущее изображение
     */
    onPrevArrowClick(): void {
        this.stopChangeImageInterval();
        this.goToPrevSlide();
        this.startChangeImageInterval();
    }

    /**
     * Переход на предыдущее изображение
     */
    goToPrevSlide() {
        let allImagesIds = this.getAllImagesIds();

        let currentImageIndex = allImagesIds.findIndex(imageId => imageId === this.state.currentSlideId);

        if (currentImageIndex === -1) {
            return;
        }

        let nextImageIndex = currentImageIndex - 1;
        nextImageIndex = nextImageIndex < 0
            ? nextImageIndex + allImagesIds.length
            : nextImageIndex;

        this.goToSlide(allImagesIds[nextImageIndex]);
    }

    /**
     * Получить ids всех изображений
     */
    getAllImagesIds() {
        if (this.props.imagesUrl) {
            return this.props.imagesUrl.map(imageUrl => this.getImageByUrlElementId(imageUrl));
        }

        return this.state.containers
            .map(container => container.nodeId)
            .concat(
                this.state.attachments.map(attachment => attachment.nodeId),
            );
    }

    /**
     * Получить id для html блока с изображением, которое вставляется по url
     * @param imageId
     */
    getImageByUrlElementId(imageId: string | number): string {
        return `${this.imageByUrlPrefix}${btoa(imageId.toString())}`;
    }

    /**
     * Получить url для изображения
     * @param imageId
     */
    getImageSrc(imageId: string): string {
        if (this.props.imagesUrl && this.props.imagesUrl.length) {
            let imageBase64Url = imageId.split(this.imageByUrlPrefix)[1];
            return imageBase64Url
                ? atob(imageBase64Url)
                : '';
        }

        return this.props.attachmentActions
            ? this.props.attachmentActions.getLinkAttachment(imageId)
            : '';
    }

    /**
     * Открыть превью изображения
     * @param imageId
     */
    openImagePreview(imageId: string) {
        if (!this.props.enableImagePreview) {
            return;
        }

        if (this.props.imagesUrl && this.props.imagesUrl.length) {
            this.setState({ imagePreviewUrl: this.getImageSrc(imageId) });
        }

        this.setState({ imagePreviewId: imageId });
    }

    /**
     * Закрыть превью изображения
     */
    closeImagePreview() {
        this.setState({
            imagePreviewUrl: null,
            imagePreviewId: null,
        });
    }

    /**
     * Запустить интервал автоматической смены картинок
     */
    startChangeImageInterval() {
        if (this.props.imageChangeInterval) {
            this.changeImageInterval = window.setInterval(() => this.onNextArrowClick(), this.props.imageChangeInterval);
        }
    }

    /**
     * Убрать интервал автоматической смены картинок
     */
    stopChangeImageInterval() {
        if (this.changeImageInterval) {
            window.clearInterval(this.changeImageInterval);
            this.changeImageInterval = null;
        }
    }

    render(): false | JSX.Element {
        return imageGalleryTemplate(this);
    }
}
