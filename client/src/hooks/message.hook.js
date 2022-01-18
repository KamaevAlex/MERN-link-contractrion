import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback(text => {
        if(window.M && text){      //Если в объекте window существует объект M, а также передан текст
            window.M.toast({html: text})
        }
}, [])
}

//M - станд. объект библиотеки Materialize