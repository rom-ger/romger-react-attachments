import * as t from 'io-ts';

/**
 * TODO: Global
 */
class TypeService {

    /**
     * Создания типа enum для io-ts
     */
    static createEnum = <E>(e: any, name: string): t.Type<E> => {
        const keys: any = {};
        Object.keys(e)
            .forEach((k: string) => (keys[e[k]] = null));
        return t.keyof(keys, name) as any;
    }

    /**
     * Показать ошибку в консоли о несоответствии типов
     */
    static showConsoleError = (idEntity: string, classEntity: string, result: any): void => {
        if (typeof window === 'undefined') {
            return;
        }
        window.console.log('============== io-ts start error =============');
        window.console.log(`Произошла ошибка при обработке данных, полученных с сервера. Сущность: ${classEntity}, id сущности: ${idEntity}`);
        result.value.forEach((value: any) => {
            let context = '';
            value.context.forEach((ctx: any) => {
                context = `${context}${ctx.key} `;
            });
            window.console.log(`Значение: ${value.value}, key: ${context}`);
        });
        window.console.log('============== io-ts end error =============');
    }

    /**
     * Проверяем один элемент
     */
    static checkElement<T>(entityType: any, entityClass: any, entityName: string, entity: any): T | null {
        let result: any = entityType.decode(entity);
        if (result.isLeft()) {
            TypeService.showConsoleError(entity.id, entityName, result);
            return null;
        }
        return new entityClass(entity);
    }
}

export { TypeService };
