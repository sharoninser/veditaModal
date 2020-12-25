class VeditaModal {
    constructor(className, params) {
        this.initParams(params);
        this.properties = {};
        this.element = document.querySelectorAll(className);
        if(this.element.length !== 0) {
            this.initModals();
        } 	
    }
    initParams(params) {
        var defaultParams = {
            closeBtn: '.vmodal-close',
        }
        this.params = {};
		for(var i = 0, arrays = [defaultParams, params]; i < arrays.length; i++){
			for(var key in arrays[i]){
				this.params[key] = arrays[i][key];
			};
        };
    }
    initModals() {
        let modals = this.element;
        
        for(var i = 0; i < modals.length; i++) {
            this.properties.body = document.querySelector('body');
            this.properties.cloneBlock = modals[i].cloneNode(true); //клонирование элементов            
            modals[i].remove(); //удаление исходных элементов
            this.properties.body.appendChild(this.properties.cloneBlock); //добавление новых окон в конец body
            this.properties.cloneBlock.classList.add('vmodal-popup');

            this.properties.wrapperModal = document.createElement('div');
            this.properties.modalInner = document.createElement('div');
            this.properties.modalSlide = document.createElement('div');
            this.properties.closeBtn = document.createElement('span');

            this.properties.wrapperModal.classList.add('vmodal-wrapper');
            this.properties.modalInner.classList.add('vmodal-inner');
            this.properties.modalSlide.classList.add('vmodal-slide');
            this.properties.closeBtn.classList.add(this.params.closeBtn.slice(1));

            // vmodal-slide
            this.properties.cloneBlock.parentNode.insertBefore(this.properties.modalSlide, this.properties.cloneBlock);
            this.properties.modalSlide.appendChild(this.properties.cloneBlock);
            // vmodal-inner
            this.properties.modalSlide.parentNode.insertBefore(this.properties.modalInner, this.properties.modalSlide);
            this.properties.modalInner.appendChild(this.properties.modalSlide);
            // vmodal-wrapper
            this.properties.modalInner.parentNode.insertBefore(this.properties.wrapperModal, this.properties.modalInner);
            this.properties.wrapperModal.appendChild(this.properties.modalInner);
            //vmodal-close
            this.properties.cloneBlock.appendChild(this.properties.closeBtn)

            this.properties.wrapperModal.style.display = 'none';
            this.onOpen();
        }
    }
    onOpen() {
        console.log(this.properties.wrapperModal);
        let buttonsClick = document.querySelectorAll('[data-vmodal]');

        for(var i = 0; i < buttonsClick.length; i++) {
            let itemButtonsClick = buttonsClick[i];
            itemButtonsClick.addEventListener('click', () => {
                let sourcePopup = itemButtonsClick.getAttribute('data-src');
                let popupBlock = document.querySelector(sourcePopup);
                if(popupBlock !== null) {
                    if(popupBlock.classList.contains('vmodal-popup')) {
                        this.properties.parentModal = popupBlock.parentElement.parentElement.parentElement;                       
                        this.properties.innerPopup = this.properties.parentModal.querySelector('.vmodal-slide');

                        let idElement = '#' + popupBlock.id;
                        this.properties.closeBtn = document.querySelector(idElement).querySelector('span');
                        this.properties.body.classList.add('vmodal-active');

                        // анимация появления окна
                        let handler = () => {
                            this.properties.parentModal.removeEventListener('animationend', handler);
                        };
                        this.properties.parentModal.style.display = 'block';
                        this.properties.parentModal.classList.add('vmodal-enter');
                        this.raf(() => {
                            this.properties.parentModal.classList.add('vmodal-is-open');
                            this.properties.parentModal.classList.remove('vmodal-enter');
                        });
                        this.properties.parentModal.addEventListener('animationend', handler);

                        this.properties.innerPopup.scrollTop = 0;
                        this.onClickClose();
                    }
                }
            });
        }
    }
    onClickClose() {
        let thisObject = this;
        this.properties.parentModal.addEventListener('click', (e) => {
            if(!e.target.closest('.vmodal-popup')) {
                thisObject.onClose();
            }
        });
        this.properties.closeBtn.addEventListener('click', () => {
            thisObject.onClose();
        });
    }
    onClose() {
        let thisObject = this;
        this.properties.body.classList.remove('vmodal-active');
        // анимация появления окна
        let handler = () => {
            this.properties.parentModal.style.display = 'none';
            this.properties.parentModal.classList.remove('vmodal-is-close');
            this.properties.parentModal.classList.remove('vmodal-is-open');
            this.properties.parentModal.removeEventListener('animationend', handler);
        };
        this.properties.parentModal.classList.add('vmodal-leave');
        thisObject.raf(() => {
            this.properties.parentModal.classList.add('vmodal-is-close');
            this.properties.parentModal.classList.remove('vmodal-leave');
        });
        // анимация появления окна
        this.properties.parentModal.addEventListener('animationend', handler);
    }
    raf(fn) {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                fn();
            });
        });
    }
}

