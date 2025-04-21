import { useSelector } from 'react-redux'
import { BarLoader } from 'react-spinners'

function GlobalLoader() {
    const isLoading = useSelector((state) => state.loading.active)

    return (
        <div className='h-1 sticky top-0 w-full z-50'>
            {isLoading ? <BarLoader color="red" cssOverride={{ width: '100%' }} /> : null}
        </div>
    )
}

export default GlobalLoader