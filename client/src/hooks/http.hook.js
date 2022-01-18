/* hook для взаимодействия с сервером */

import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback( async (url, method = 'GET', body = null, headers = {}) =>{
        setLoading(  true)
        try{

            /* Если body есть, то переводим его в строку, чтоб избежать ошибок */
            if(body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json' /* Явно указываем, что передаем JSON, иначе придет пустой объект */
            }

            const response = await fetch(url, {method, body, headers})
            const data = await response.json()                  /*!!!распарсить*/

            /* Если в response поле ok = false, то выводим сообщение об ошибке из data либо текст */
            if(!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так')
            }

            setLoading(false)

            /* Если все нормально, возвращаем data с сервера */
            return data

            /* При ошибке с сервера попадаем в catch */
        } catch (e) {
            setLoading(false)
            setError(e.message)     /* (Error.data.message) */
            throw e
        }
    }, [])


    const clearError = useCallback(() => setError(null), [])
    //Ф-ция очистки ошибок, обязательно как callback

    return {loading, request, error, clearError}
}