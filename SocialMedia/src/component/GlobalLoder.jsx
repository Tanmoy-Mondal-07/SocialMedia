import { useSelector } from 'react-redux'
import { BarLoader } from 'react-spinners'

function GlobalLoader() {
    const isLoading = useSelector((state) => state.loading.active)

    return (
        <div style={{height:'.2rem', width:'100%',backgroundColor:'#ffffff'}}>
            {isLoading ? <BarLoader color="red" cssOverride={{ width: '100%' }} /> : null}
        </div>
    )
}

export default GlobalLoader