import {defineConfig} from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default ({mode}) => {
    require('dotenv').config({path: `./.env`});
    // now you can access config with process.env.{configName}

    return defineConfig({
        plugins: [reactRefresh()],
        define: {
            'process.env': process.env
        }
    })
}
