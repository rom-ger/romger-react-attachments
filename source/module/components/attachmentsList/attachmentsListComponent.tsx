import { RgReactBaseComponent } from '@romger/react-base-components';
import Axios, { CancelTokenSource } from 'axios';
import plural from 'plural-ru';
import * as React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { Attachment, CollectionDTOInterface, IExtensionTypeObject } from '../../../interfaces';
import { FileContainer } from '../../../models';
import { LoadingBarHelpers } from '../../helpers/loadingBarHelpers';
import { AttachmentsCheckResult } from '../../interfaces/attachmentsCheckResult';
import { IAttachmentActions } from '../../interfaces/IAttachmentActions';
import { AttachmentService } from '../../services/attachmentService';
import { TransliterationService } from '../../services/transliterationService';
import attachmentListTemplate from './attachmentsListTemplate';

interface AttachmentsListProps {
    // with cs-service
    value?: string[];
    attachmentActions?: IAttachmentActions;
    onChange?: (attachmentIds: string[]) => void;

    // Работа с multipart
    localMultipartMode?: boolean;
    onChangeMultipart?: (files: File[]) => void;

    // common params
    dragNDropTitle?: string;
    disableDragNDrop?: boolean;
    showIncludeToast?: boolean;
    availableAttachmentsCount?: number;
    availableAttachmentsTotalSize?: number;
    availableAttachmentsExtensions?: IExtensionTypeObject[];

    hideRemoveAttachmentButton?: boolean;
    hideLoadMoreBlock?: boolean;
    hideEmptyBlock?: boolean;
    hideWarningLabel?: boolean;
    withoutBorder?: boolean;

    onUploadErrors?: (errors: string[]) => any;
    toggleIsLoadingStatus?: (uploadLock: boolean) => void;
}

interface AttachmentsListState {
    attachments: FileContainer[];
    dragOverModeDropBlock: boolean;
    mouseOverModeDropBlock: boolean;
    loadingAttachmentsIds: Map<string, string>;
    attachmentsLoadingProgress: Map<string, number>;
    attachmentsLoadCancelSources: Map<string, CancelTokenSource>;
    initialLoading: boolean;
    selectedContainerIdForPreview: string | null;
    multiPartFiles: File[];
}

export interface AttachmentsListInterface {
    state: AttachmentsListState;
    props: AttachmentsListProps;
    dropFilesBlock: HTMLElement | null;
    inputBlock: HTMLInputElement | null;
    dragOverMode: boolean;
    showDropBlock: boolean;
    showWarningLabel: boolean;
    allowMultipleLoad: boolean;
    attachmentsLength: number;
    inputAcceptAttribute: string;
    allAttachmentIds: string[];

    openFileSelectDialog(): void;

    getWarningLabelText(): string;

    deleteAttachment(nodeId: string): void;

    downloadAttachment(nodeId: string): void;

    cancelLoadingAttachment(nodeId: string): void;

    getArcForElement(nodeId: string): string;

    ellipsizeTextElement(elementRef: HTMLElement): void;

    onInputSelectFiles(e: React.ChangeEvent<HTMLInputElement>): void;

    updateState<T>(value: T | null, field: string, callback?: () => any, timeout?: number): void;

    isShowImageThumbnail(containerId: string): boolean;

    isContainerLoading(containerId: string): boolean;

    resetComponentAttachments(): void;

    deleteMultipartFile(index: number): void;
}

export default class AttachmentsList extends RgReactBaseComponent<AttachmentsListProps, AttachmentsListState> implements AttachmentsListInterface {
    state: AttachmentsListState = {
        attachments: [],
        dragOverModeDropBlock: false,
        mouseOverModeDropBlock: false,
        loadingAttachmentsIds: new Map<string, string>(),
        attachmentsLoadingProgress: new Map<string, number>(),
        attachmentsLoadCancelSources: new Map<string, CancelTokenSource>(),
        initialLoading: false,
        selectedContainerIdForPreview: null,
        multiPartFiles: [],
    };

    dropFilesBlock: HTMLElement | null = null;
    inputBlock: HTMLInputElement | null = null;

    componentWillMount() {
        if (!!this.props.value && !!this.props.value.length) {
            this.attachmentsLoad(this.props.value);
        }
    }

    componentDidMount() {
        this.initDragNDropEvents();
    }

    componentWillReceiveProps(nextProps: Readonly<AttachmentsListProps>): void {
        if (
            !!nextProps.value
            && !!this.props.value
            && this.isAttachmentChanged(nextProps.value, this.props.value)
            && !this.isAttachmentsLoading
        ) {
            this.attachmentsLoad(nextProps.value);
        }
    }

    get allAttachmentIds() {
        if (!!this.state.attachments && !!this.state.attachments.length) {
            return this.state.attachments.filter((el: FileContainer) =>  !!el.extensionType && !!el.extensionType.isImage)
                                         .map((el: FileContainer) => el.nodeId);
        }
        return [];
    }

    get dragOverMode() {
        return this.state.dragOverModeDropBlock;
    }

    get showDropBlock() {
        return !this.state.mouseOverModeDropBlock && !this.props.disableDragNDrop;
    }

    get isAttachmentsLoading() {
        return !!this.state.loadingAttachmentsIds.size;
    }

    get currentAttachmentsTotalSize() {
        return this.state.attachments
            .map(attachment => !!attachment.fileSize ? attachment.fileSize : 0)
            .reduce((prev, curr) => prev + curr, 0);
    }

    get attachmentsCountLeft() {
        if (!this.props.availableAttachmentsCount) {
            return 0;
        }

        return this.props.availableAttachmentsCount - this.state.attachments.length;
    }

    get attachmentsTotalSizeLeft() {
        if (!this.props.availableAttachmentsTotalSize) {
            return 0;
        }

        return this.props.availableAttachmentsTotalSize - this.currentAttachmentsTotalSize;
    }

    get showWarningLabel() {
        let showBorder = 0.75;
        return (!!this.props.availableAttachmentsCount && (this.state.attachments.length / this.props.availableAttachmentsCount) >= showBorder) ||
            (!!this.props.availableAttachmentsTotalSize && (this.currentAttachmentsTotalSize / this.props.availableAttachmentsTotalSize) >= showBorder);
    }

    get allowMultipleLoad() {
        if (typeof this.props.availableAttachmentsCount === 'undefined') {
            return true;
        }

        return this.props.availableAttachmentsCount !== 1;
    }

    get attachmentsLength() {
        return this.props.localMultipartMode
            ? this.state.multiPartFiles.length
            : this.state.attachments.length;
    }

    get inputAcceptAttribute() {
        return !this.props.availableAttachmentsExtensions
            ? '*'
            : this.props.availableAttachmentsExtensions.map(extension => extension.acceptTypes)
                .reduce((prev, next) => prev.concat(next), [])
                .join(',');
    }

    /**
     * Загрузить вложения по ids
     * @param attachmentsIds
     */
    attachmentsLoad(attachmentsIds: string[]) {
        this.setState({ initialLoading: true });
        this.props.attachmentActions?.getAllInfo(attachmentsIds)
            .then((attachments: CollectionDTOInterface<FileContainer>) => this.setState({ attachments: attachments.items, initialLoading: false }))
            .catch(() => this.setState({ initialLoading: false }));
    }

    /**
     * Изменился ли список вложений в компоненте
     * @param newAttachmentsIds
     */
    isAttachmentChanged(newAttachmentsIds: string[], oldAttachmentsIds: string[]) {
        let attachmentChanged = true;
        if (
            !oldAttachmentsIds.length && !newAttachmentsIds.length ||
            oldAttachmentsIds.length === newAttachmentsIds.length &&
            oldAttachmentsIds.every((oldId: string) => !!newAttachmentsIds.some(el => el === oldId))
        ) {
            attachmentChanged = false;
        }
        return attachmentChanged;
    }

    initDragNDropEvents() {
        if (this.dropFilesBlock && !this.props.disableDragNDrop) {
            this.dropFilesBlock.addEventListener('drop', this.doDragEvent.bind(this, this.dropEventHandler), false);
            this.dropFilesBlock.addEventListener('dragover', this.doDragEvent.bind(this, () => null), false);
            this.dropFilesBlock.addEventListener('dragenter', this.doDragEvent.bind(this, this.dragEnterEventHandler.bind(this)), false);
            this.dropFilesBlock.addEventListener('dragleave', this.doDragEvent.bind(this, this.dragLeaveEventHandler.bind(this)), false);
        }
    }

    /**
     * Предотвратить дефолтное поведение и передать управление обработчику события
     */
    doDragEvent(eventHandler: (e: DragEvent) => void, e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (eventHandler) {
            eventHandler.call(this, e);
        }
    }

    /**
     * Обработчик события drop
     * @param e
     */
    dropEventHandler(e: DragEvent) {
        const uploadAction = this.uploadAction();

        if (e.dataTransfer && !!e.dataTransfer.files.length) {
            uploadAction(Array.from(e.dataTransfer.files));
        }

        this.setState({ dragOverModeDropBlock: false });
    }

    /**
     * Обработчик события dragEnter
     */
    dragEnterEventHandler() {
        this.setState({ dragOverModeDropBlock: true });
    }

    /**
     * Обработчик события dragLeave
     */
    dragLeaveEventHandler() {
        this.setState({ dragOverModeDropBlock: false });
    }

    /**
     * Действие загрузки файлов
     */
    uploadAction(): (files: File[]) => any {
        return this.props.localMultipartMode
            ? this.uploadLocalMultipartFiles.bind(this)
            : this.uploadAttachments.bind(this);
    }

    /**
     * Загрузить вложения на сервер
     * @param files
     */
    uploadAttachments(files: File[]) {
        // Скрываем все тосты с ошибками
        toast.dismiss();
        this.onToggleIsLoadingStatus(true);

        let attachments: Attachment[] = files.map((file: File) => AttachmentService.getFileField(file));

        let attachmentsCheckResult = this.checkLoadedFiles(attachments);

        if (!!attachmentsCheckResult.errors.length) {
            this.showAttachmentsUploadErrors(attachmentsCheckResult.errors);
        }

        attachmentsCheckResult.checkPassedAttachments.forEach((attachment: Attachment, index: number) => {
            let fileReader = new FileReader();

            fileReader.onload = (e: Event) => {
                let stateAttachments = this.state.attachments;
                let stateLoadingAttachmentsIds = this.state.loadingAttachmentsIds;

                // Avoiding InvalidCharacterError in btoa
                let tempAttachmentId = btoa(TransliterationService.transliterate(`${attachment.name}_${attachment.size}_${index}_${new Date().getTime()}`));
                let loadedAttachment = new FileContainer({
                    nodeId: tempAttachmentId,
                    nodeName: attachment.name,
                    fileSize: attachment.size,
                });

                stateAttachments.push(loadedAttachment);
                stateLoadingAttachmentsIds.set(tempAttachmentId, tempAttachmentId);

                this.setState(
                    {
                        attachments: stateAttachments,
                        loadingAttachmentsIds: stateLoadingAttachmentsIds,
                    },
                    () => this.uploadAttachmentToServer(attachment, loadedAttachment.nodeId),
                );
            };

            fileReader.readAsDataURL(attachment.multiPartFile);
        });
    }

    /**
     * Загрузить multipart локально и вернуть из компонента массив типа File
     * @param files
     */
    uploadLocalMultipartFiles(files: File[]) {
        // Скрываем все тосты с ошибками
        toast.dismiss();

        let attachments: Attachment[] = files.map((file: File) => AttachmentService.getFileField(file));

        let attachmentsCheckResult = this.checkLoadedFiles(attachments);

        if (!!attachmentsCheckResult.errors.length) {
            this.showAttachmentsUploadErrors(attachmentsCheckResult.errors);
        }

        const newMultiPartFiles = this.state.multiPartFiles
            .concat(attachmentsCheckResult.checkPassedAttachments.map(attachment => attachment.multiPartFile));

        this.setState(
            { multiPartFiles: newMultiPartFiles },
            () => this.props.onChangeMultipart?.(newMultiPartFiles),
        );
    }

    /**
     * Получаем данные о прогрессе загрузки файла на сервер
     */
    onUploadProgress(nodeId: string, progress: ProgressEvent) {
        let stateAttachmentsLoadingProgress = this.state.attachmentsLoadingProgress;
        stateAttachmentsLoadingProgress.set(nodeId, Math.round((progress.loaded * 100) / progress.total));
        this.setState({ attachmentsLoadingProgress: stateAttachmentsLoadingProgress });
    }

    /**
     * Загружаем вложение на сервер
     * @param attachment
     * @param nodeId
     */
    uploadAttachmentToServer(attachment: Attachment, nodeId: string) {
        let cancelTokenSource = Axios.CancelToken.source();
        let stateAttachmentsLoadCancelSources = this.state.attachmentsLoadCancelSources;
        stateAttachmentsLoadCancelSources.set(nodeId, cancelTokenSource);
        this.setState({ attachmentsLoadCancelSources: stateAttachmentsLoadCancelSources });

        this.props.attachmentActions?.createAttachment(attachment.multiPartFile, this.onUploadProgress.bind(this, nodeId), cancelTokenSource.token)
            .then((stateContainer: FileContainer) => {
                let stateAttachments = this.state.attachments;
                let stateLoadingAttachmentsIds = this.state.loadingAttachmentsIds;
                let stateAttachmentsLoadingProgress = this.state.attachmentsLoadingProgress;

                stateLoadingAttachmentsIds.delete(nodeId);
                stateAttachmentsLoadingProgress.delete(nodeId);

                stateAttachments = stateAttachments.map((stateAttachment: FileContainer) => {
                    if (stateAttachment.nodeId !== nodeId) {
                        return stateAttachment;
                    }

                    return stateContainer;
                });

                this.setState(
                    {
                        loadingAttachmentsIds: stateLoadingAttachmentsIds,
                        attachments: stateAttachments,
                        attachmentsLoadingProgress: stateAttachmentsLoadingProgress,
                    },
                    () => {
                        if (!this.isAttachmentsLoading) {
                            this.onToggleIsLoadingStatus(false);
                            this.onChange(this.state.attachments);
                        }
                    },
                );
            })
            .catch((error: any) => {
                if (error.response && error.response.status) {
                    let stateAttachments = this.state.attachments;
                    let stateLoadingAttachmentsIds = this.state.loadingAttachmentsIds;
                    let stateAttachmentsLoadingProgress = this.state.attachmentsLoadingProgress;

                    stateAttachments = stateAttachments.filter(stateAttachment => stateAttachment.nodeId !== nodeId);
                    stateLoadingAttachmentsIds.delete(nodeId);
                    stateAttachmentsLoadingProgress.delete(nodeId);

                    this.setState({
                        attachments: stateAttachments,
                        loadingAttachmentsIds: stateLoadingAttachmentsIds,
                        attachmentsLoadingProgress: stateAttachmentsLoadingProgress,
                    });

                    this.showAttachmentsUploadErrors([`При загрузке вложения ${attachment.name} произошла ошибка`]);
                }
            });
    }

    /**
     * Изменение массива вложений
     */
    onChange(attachments: FileContainer[]) {
        if (this.props.onChange) {
            let attachmentsIds = attachments.map(attachment => attachment.nodeId);
            this.props.onChange(attachmentsIds);
        }
    }

    /**
     * Отдаём информацию о "блокировке" компонента во время загрузки файлов
     */
    onToggleIsLoadingStatus(uploadLock: boolean) {
        if (this.props.toggleIsLoadingStatus) {
            this.props.toggleIsLoadingStatus(uploadLock);
        }
    }

    /**
     * Отмена загрузки вложения
     */
    cancelLoadingAttachment(nodeId: string) {
        let cancelTokenSource = this.state.attachmentsLoadCancelSources.get(nodeId);

        if (cancelTokenSource) {
            cancelTokenSource.cancel();

            let stateAttachments = this.state.attachments;
            let stateLoadingAttachmentsIds = this.state.loadingAttachmentsIds;
            let stateAttachmentsLoadingProgress = this.state.attachmentsLoadingProgress;
            let stateAttachmentsLoadCancelSources = this.state.attachmentsLoadCancelSources;

            stateAttachments = stateAttachments.filter((stateContainer: FileContainer) => stateContainer.nodeId !== nodeId);
            stateLoadingAttachmentsIds.delete(nodeId);
            stateAttachmentsLoadingProgress.delete(nodeId);
            stateAttachmentsLoadCancelSources.delete(nodeId);

            this.setState(
                {
                    attachments: stateAttachments,
                    loadingAttachmentsIds: stateLoadingAttachmentsIds,
                    attachmentsLoadingProgress: stateAttachmentsLoadingProgress,
                    attachmentsLoadCancelSources: stateAttachmentsLoadCancelSources,
                },
                () => {
                    if (!this.isAttachmentsLoading) {
                        this.onToggleIsLoadingStatus(false);
                        this.onChange(this.state.attachments);
                    }
                });
        }
    }

    /**
     * Выбор файлов в инпуте
     */
    onInputSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target || !e.target.files || !e.target.files.length) {
            return;
        }

        const uploadAction = this.uploadAction();

        uploadAction(Array.from(e.target.files));

        if (this.inputBlock) {
            this.inputBlock.value = '';
        }
    }

    /**
     * Открыть диалог выбора файлов
     */
    openFileSelectDialog() {
        if (!this.inputBlock) {
            return;
        }

        this.inputBlock.click();
    }

    /**
     * Проверить файлы на соответствия условиям загрузки
     * @param attachments
     */
    checkLoadedFiles(attachments: Attachment[]): AttachmentsCheckResult {
        let attachmentsTotalSize = attachments
            .map(attachment => !!attachment.size ? attachment.size : 0)
            .reduce((prev, curr) => prev + curr, 0);

        let currentAttachmentsTotalSize = this.currentAttachmentsTotalSize;

        let checkResult: AttachmentsCheckResult = {
            checkPassedAttachments: [],
            errors: [],
        };

        if (this.props.availableAttachmentsTotalSize && attachmentsTotalSize + currentAttachmentsTotalSize > this.props.availableAttachmentsTotalSize) {
            checkResult.errors.push(`Размер всех файлов превышает ${AttachmentService.getSizeText(this.props.availableAttachmentsTotalSize)}`);
            return checkResult;
        }

        if (this.props.availableAttachmentsCount && attachments.length + this.state.attachments.length > this.props.availableAttachmentsCount) {
            checkResult.errors.push(`Максимальное количество файлов: ${this.props.availableAttachmentsCount}`);
            return checkResult;
        }

        attachments.forEach((attachment: Attachment) => {
            let attachmentExtension = AttachmentService.getFileExtensionFromFullName(attachment.name)
                .toLowerCase();
            let availableAttachmentsExtensions = this.props.availableAttachmentsExtensions
                ? this.props.availableAttachmentsExtensions
                : [];

            if (!!availableAttachmentsExtensions.length) {
                if (
                    !!availableAttachmentsExtensions.filter((extensionType: IExtensionTypeObject) => {
                        if (extensionType.extension === attachmentExtension) {
                            return true;
                        }
                        if (!extensionType.subExtensions || !extensionType.subExtensions.length) {
                            return false;
                        }
                        return extensionType.subExtensions.some(el => el === attachmentExtension);
                    }).length
                ) {
                    checkResult.checkPassedAttachments.push(attachment);
                } else {
                    checkResult.errors.push(`Файл ${attachment.name} имеет недопустимый формат`);
                }
            } else {
                checkResult.checkPassedAttachments.push(attachment);
            }
        });

        return checkResult;
    }

    /**
     * Проставить многоточие в имени файла, если оно не влезает в блок
     */
    ellipsizeTextElement(elementRef: HTMLElement): void {
        if (!elementRef) {
            return;
        }

        let textElementContent = elementRef.innerHTML;

        while (elementRef.scrollHeight > elementRef.offsetHeight) {
            textElementContent = textElementContent.slice(0, -1);
            elementRef.innerHTML = `${textElementContent}...`;
        }
    }

    /**
     * Получить параметры для LoadingBar
     */
    getArcForElement(nodeId: string): string {
        let loadingProgress = this.state.attachmentsLoadingProgress.get(nodeId);
        let LOADING_BAR_X = 21;
        let LOADING_BAR_Y = 21;
        let LOADING_BAR_RADIUS = 18;

        if (!loadingProgress) {
            loadingProgress = 0;
        }

        let loadingBarEndAngle = Math.round((loadingProgress / 100) * 360);
        loadingBarEndAngle = loadingBarEndAngle === 360 ? loadingBarEndAngle - 1 : loadingBarEndAngle;

        return LoadingBarHelpers.describeArc(LOADING_BAR_X, LOADING_BAR_Y, LOADING_BAR_RADIUS, 0, loadingBarEndAngle);
    }

    /**
     * Удалить multipart файл из списка
     * @param index
     */
    deleteMultipartFile(index: number) {
        let multiPartFiles = this.state.multiPartFiles;
        multiPartFiles = multiPartFiles.filter((_file, fileIndex) => fileIndex !== index);
        this.setState(
            { multiPartFiles },
            () => this.props.onChangeMultipart?.(multiPartFiles),
        );
    }

    /**
     * Удалить вложение
     * @param nodeId
     */
    deleteAttachment(nodeId: string) {
        let attachments = this.state.attachments;
        attachments = attachments.filter(attachment => attachment.nodeId !== nodeId);
        this.setState({ attachments }, () => {
            if (!this.isAttachmentsLoading) {
                this.onChange(this.state.attachments);
            }
        });
    }

    /**
     * Скачать вложение
     * @param nodeId
     */
    downloadAttachment(nodeId: string) {
        return this.props.attachmentActions?.downloadAttachment(nodeId);
    }

    /**
     * Получить шаблон для ошибок в тосте
     * @param errors
     */
    getErrorsHtml(errors: string[]): JSX.Element {
        return (
            <>
                {
                    errors.map((error, index) => (
                        <div
                            key={index}
                            className={'global-toast__error-string'}
                        >
                            {error}
                        </div>
                    ))
                }
            </>
        );
    }

    /**
     * Показать ошибки загрузки вложений
     * @param errors
     * @param onClose
     */
    showAttachmentsUploadErrors(errors: string[], onClose?: () => void) {
        let config: ToastOptions = {
            position: toast.POSITION.BOTTOM_RIGHT,
            pauseOnHover: true,
            autoClose: 8000,
        };

        if (onClose) {
            config.onClose = onClose;
        }

        this.props.onUploadErrors?.(errors);

        return toast.error(this.getErrorsHtml(errors), config);
    }

    /**
     * Получить текст для лейбла с лимитами
     */
    getWarningLabelText(): string {
        let warningString = '';

        if (!!this.props.availableAttachmentsCount && !!this.props.availableAttachmentsTotalSize) {
            let pluralString = plural(this.attachmentsCountLeft, '%d файла', '%d файлов', '%d файлов');
            warningString = `Вы можете загрузить еще ${AttachmentService.getSizeText(this.attachmentsTotalSizeLeft)}, но не более ${pluralString}`;
        }

        if (!this.props.availableAttachmentsCount && !!this.props.availableAttachmentsTotalSize) {
            warningString = `Вы можете загрузить еще ${AttachmentService.getSizeText(this.attachmentsTotalSizeLeft)}`;
        }

        if (!!this.props.availableAttachmentsCount && !this.props.availableAttachmentsTotalSize) {
            let pluralString = plural(this.attachmentsCountLeft, '%d файл', '%d файла', '%d файлов');
            warningString = `Вы можете загрузить еще ${pluralString}`;
        }

        if (!!this.props.availableAttachmentsCount && this.attachmentsCountLeft === 0) {
            let pluralString = plural(this.props.availableAttachmentsCount, '%d файл', '%d файла', '%d файлов');
            warningString = `Вы загрузили максимальное количество файлов (${pluralString})`;
        }

        if (!!this.props.availableAttachmentsTotalSize && this.attachmentsTotalSizeLeft === 0) {
            warningString = `Вы достигли лимита на общий размер файлов (${AttachmentService.getSizeText(this.props.availableAttachmentsTotalSize)})`;
        }

        return warningString;
    }

    /**
     * Загружается ли контейнер
     * @param containerId
     */
    isContainerLoading(containerId: string): boolean {
        return this.state.loadingAttachmentsIds.has(containerId);
    }

    /**
     * Показывать ли миниатюру изображения
     */
    isShowImageThumbnail(containerId: string): boolean {
        let findedContainer = this.state.attachments.find(stateAttachment => stateAttachment.nodeId === containerId);
        return !(!findedContainer || !findedContainer.extensionType || !findedContainer.extensionType.isImage || this.isContainerLoading(containerId));
    }

    /**
     * Удалить все вложения в компоненте
     */
    resetComponentAttachments() {
        this.setState({
            attachments: [],
            loadingAttachmentsIds: new Map<string, string>(),
            attachmentsLoadingProgress: new Map<string, number>(),
            attachmentsLoadCancelSources: new Map<string, CancelTokenSource>(),
        });
    }

    render(): false | JSX.Element {
        return attachmentListTemplate(this);
    }
}
