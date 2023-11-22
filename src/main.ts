import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElIcons from "@element-plus/icons-vue";
import Goban from './components/Goban.vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 注册富文本组件
const app = createApp(App);
app.use(store).use(router).use(ElementPlus).component('QuillEditor', QuillEditor) .component('goban', Goban).mount('#app');
// 全局注册element plus的icon
for (const name in ElIcons) {
    app.component(name, (ElIcons as any)[name]);
}
