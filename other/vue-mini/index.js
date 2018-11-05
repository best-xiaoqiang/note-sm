class Vue{
    constructor(options = {}){
        this.$el = document.querySelector(options.el);
        let data = this.data = options.data;
        // 浠ｇ悊data锛屼娇鍏惰兘鐩存帴this.xxx鐨勬柟寮忚闂甦ata锛屾甯哥殑璇濋渶瑕乼his.data.xxx
        Object.keys(data).forEach((key)=> {
            this.proxyData(key);
        });
        this.methods = options.methods // 浜嬩欢鏂规硶
        this.watcherTask = {}; // 闇€瑕佺洃鍚殑浠诲姟鍒楄〃
        this.observer(data); // 鍒濆鍖栧姭鎸佺洃鍚墍鏈夋暟鎹�
        this.compile(this.$el); // 瑙ｆ瀽dom
    }
    proxyData(key){
        let that = this;
        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            get () {
                return that.data[key];
            },
            set (newVal) {
                that.data[key] = newVal;
            }
        });
    }
    observer(data){
        let that = this
        Object.keys(data).forEach(key=>{
            let value = data[key]
            this.watcherTask[key] = []
            Object.defineProperty(data,key,{
                configurable: false,
                enumerable: true,
                get(){
                    return value
                },
                set(newValue){
                    if(newValue !== value){
                        value = newValue
                        that.watcherTask[key].forEach(task => {
                            task.update()
                        })
                    }
                }
            })
        })
    }
    compile(el){
        var nodes = el.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(node.nodeType === 3){
                var text = node.textContent.trim();
                if (!text) continue;
                this.compileText(node,'textContent')
            }else if(node.nodeType === 1){
                if(node.childNodes.length > 0){
                    this.compile(node)
                }
                if(node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')){
                    node.addEventListener('input',(()=>{
                        let attrVal = node.getAttribute('v-model')
                        this.watcherTask[attrVal].push(new Watcher(node,this,attrVal,'value'))
                        node.removeAttribute('v-model')
                        return () => {
                            this.data[attrVal] = node.value
                        }
                    })())
                }
                if(node.hasAttribute('v-html')){
                    let attrVal = node.getAttribute('v-html');
                    this.watcherTask[attrVal].push(new Watcher(node,this,attrVal,'innerHTML'))
                    node.removeAttribute('v-html')
                }
                this.compileText(node,'innerHTML')
                if(node.hasAttribute('@click')){
                    let attrVal = node.getAttribute('@click')
                    node.removeAttribute('@click')
                    node.addEventListener('click',e => {
                        this.methods[attrVal] && this.methods[attrVal].bind(this)()
                    })
                }
            }
        }
    }
    compileText(node,type){
        let reg = /\{\{(.*?)\}\}/g, txt = node.textContent;
        if(reg.test(txt)){
            node.textContent = txt.replace(reg,(matched,value)=>{
                let tpl = this.watcherTask[value] || []
                tpl.push(new Watcher(node,this,value,type))
                if(value.split('.').length > 1){
                    let v = null
                    value.split('.').forEach((val,i)=>{
                        v = !v ? this[val] : v[val]
                    })
                    return v
                }else{
                    return this[value]
                }
            })
        }
    }
}

class Watcher{
    constructor(el,vm,value,type){
        this.el = el;
        this.vm = vm;
        this.value = value;
        this.type = type;
        this.update()
    }
    update(){
        this.el[this.type] = this.vm.data[this.value]
    }
}