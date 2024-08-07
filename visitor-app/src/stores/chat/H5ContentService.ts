interface H5ContentService{

}
class H5ContentServiceImpl implements H5ContentService{

    public h5Content: H5Content;

    public builder(){
        this.h5Content = new H5Content();
        return this;
    };

    public resourceUri(resourceUri:String){
        if (!this.h5Content){
            this.h5Content = new H5Content();
        }
        this.h5Content.resourceUri = resourceUri;
        return this;
    }

    public resourceUrl(resourceUrl:String){
        if (!this.h5Content){
            this.h5Content = new H5Content();
        }
        this.h5Content.resourceUrl = resourceUrl;
        return this;
    }

    public resourceMode(resourceMode:ResourceMode){
        if (!this.h5Content){
            this.h5Content = new H5Content();
        }
        this.h5Content.resourceMode = resourceMode;
        return this;
    }

    public build(): HTMLElement{
        let element:HTMLElement;
        switch (this.h5Content.resourceMode){
            case ResourceMode.picture:{
                element = document.createElement(`img`)
                element.src = this.h5Content.resourceUri
                // element.
                break;
            }
            case ResourceMode.audio:{
                element = document.createElement(`audio`)
                element.controls = true;
                let source = document.createElement(`source`)
                source.src = this.h5Content.resourceUri
                element.appendChild(source);
                break;
            }
            case ResourceMode.video:{
                element = document.createElement(`video`)
                element.controls = true;
                let source = document.createElement(`source`)
                source.src = this.h5Content.resourceUri
                element.appendChild(source);
                break;
            }
            case ResourceMode.voice:{

                break;
            }
            case ResourceMode.file:{
                break;
            }
        }
        return element;
    };

    /**
     *
     * @param suffix
     */
    public parse(suffix:string){
        let picture= ['.jpg', '.png', '.jpeg', '.svg', '.gif', '.bmp', '.webp'];
        let video= ['.avi', '.wmv', '.mpg', 'mpeg', '.mov', '.rm', '.ram', '.swf', '.flv', '.mp4'];
        let audio= ['.wav', '.mp3'];
        let resourceMode:ResourceMode = null;
        if (picture.indexOf(suffix) > 0){
            resourceMode = ResourceMode.picture;
        }else if(video.indexOf(suffix) >0){
            resourceMode = ResourceMode.video;
        } else if(audio.indexOf(suffix) >0){
            resourceMode = ResourceMode.audio;
        }

        if (resourceMode){
            if (this.h5Content){
                this.h5Content = new H5Content();
            }
            this.h5Content.resourceMode = resourceMode;
        }
        return this;
    }

}
export const h5ContentService = new H5ContentServiceImpl();

class H5Content{

    /**
     * 可访问资源uri
     */
    public resourceUri:String;

    /**
     * 可访问资源url
     */
    public resourceUrl:String;

    /**
     * 资源类型
     */
    public resourceMode:ResourceMode;
}

/**
 * 资源类型
 *
 * @author jiashuai.tang
 * @since 2024/08/01
 */
export enum ResourceMode{
    picture='picture',
    voice='voice',
    video='video',
    audio='audio',
    file='file'
}