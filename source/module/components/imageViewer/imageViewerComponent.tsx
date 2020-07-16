import { RgReactBaseComponent } from '@romger/react-base-components';
import * as React from 'react';
import { componentWillAppendToBody } from 'react-append-to-body';
import { FileContainer } from '../../../models';
import { IAttachmentActions } from '../../interfaces/IAttachmentActions';
import imageViewerTemplate from './imageViewerTemplate';

interface ImageViewerProps {
    attachmentActions?: IAttachmentActions;
    fileContainerId?: string | null;
    allContainerIds?: string[];
    url?: string | null;
    onClose: () => void;
}

interface ImageViewerState {
    fileContainer: FileContainer | null;
}

export interface ImageViewerInterface {
    state: ImageViewerState;
    props: ImageViewerProps;
    KEY_RIGHT: number;
    KEY_LEFT: number;
    KEY_ESCAPE: number;

    showPrevArrow: () => boolean;
    showNextArrow: () => boolean;
    goToPrev: () => any;
    goToNext: () => any;

    downloadImage(): void;

    getImageSrc(): string;
}

export default class ImageViewer extends RgReactBaseComponent<ImageViewerProps, ImageViewerState> implements ImageViewerInterface {
    KEY_RIGHT: number = 39;
    KEY_LEFT: number = 37;
    KEY_ESCAPE: number = 27;
    state: ImageViewerState = {
        fileContainer: null,
    };

    componentWillUnmount() {
        window.removeEventListener('keydown', this.callbackPressKey);
    }

    componentWillMount(): void {
        if (this.props.url || !this.props.attachmentActions) {
            return;
        }
        window.addEventListener('keydown', this.callbackPressKey);

        if (this.props.fileContainerId) {
            this.loadAttachment(this.props.fileContainerId);
        }
    }

    /**
     * Следим за нажатием клавиш
     */
    callbackPressKey = (e: KeyboardEvent) => {
        if (this.showNextArrow() && e.keyCode === this.KEY_RIGHT) {
            this.goToNext();
        }
        if (this.showPrevArrow() && e.keyCode === this.KEY_LEFT) {
            this.goToPrev();
        }
        if (e.keyCode === this.KEY_ESCAPE) {
            this.props.onClose();
        }
    }

    loadAttachment = (id: string) => {
        if (!this.props.attachmentActions) {
            return;
        }
        this.props.attachmentActions.getContainerInfo(id)
            .then(fileContainer => this.setState({ fileContainer }));
    }

    wrapperItems({ children }: any) {
        return <div>{children}</div>;
    }

    /**
     * Скачать изображение
     */
    downloadImage() {
        if (this.props.url) {
            window.open(this.props.url);
        }

        if (this.state.fileContainer && this.props.attachmentActions) {
            return this.props.attachmentActions.downloadAttachment(this.state.fileContainer.nodeId);
        }
    }

    /**
     * Получить url для изображения
     */
    getImageSrc(): string {
        if (this.props.url) {
            return this.props.url;
        }

        if (this.state.fileContainer && this.props.attachmentActions) {
            return this.props.attachmentActions.getLinkAttachment(this.state.fileContainer.nodeId);
        }

        return '';
    }

    getIndexById = (): number => {
        if (!this.state.fileContainer || !this.props.allContainerIds || !this.props.allContainerIds.length) {
            return -1;
        }
        return this.props.allContainerIds.findIndex((id: string) => id === this.state.fileContainer?.nodeId);
    }

    /**
     * Показать стрелку назад
     */
    showPrevArrow = (): boolean => {
        let index: number = this.getIndexById();
        if (index === -1) {
            return false;
        }
        return true;
    }

    /**
     * Показать стрелку вперёд
     */
    showNextArrow = (): boolean => {
        let index: number = this.getIndexById();
        if (index === -1) {
            return false;
        }
        return true;
    }

    /**
     * Вернуться на предыдущее фото
     */
    goToPrev = () => {
        let index: number = this.getIndexById();
        if (index === -1 || !this.props.allContainerIds) {
            return;
        }
        this.loadAttachment(this.props.allContainerIds[index === 0 ? (this.props.allContainerIds.length - 1) : (index - 1)]);
    }

    /**
     * Перейти на следующее фото
     */
    goToNext = () => {
        let index: number = this.getIndexById();
        if (index === -1 || !this.props.allContainerIds) {
            return;
        }
        this.loadAttachment(this.props.allContainerIds[index === this.props.allContainerIds.length - 1 ? 0 : (index + 1)]);
    }

    render(): false | JSX.Element {
        const AppendedWrapperItems = componentWillAppendToBody(this.wrapperItems);
        return (
            <AppendedWrapperItems>
                {
                    imageViewerTemplate(this)
                }
            </AppendedWrapperItems>
        );
    }
}
