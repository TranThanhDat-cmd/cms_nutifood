import { Viewer } from './viewer';

class ViewEntity {
  zoomValue:number;
  speedValue:number;
  options: any;
  el:HTMLElement;
  viewer?: Viewer;
  constructor(el:HTMLElement, rootFile:string, zoomValue:number, speedValue:number) {
    this.zoomValue = zoomValue;
    this.speedValue = speedValue;
    this.options = {
      kiosk: false,
      model:  '',
      preset:  '',
      cameraPosition: null,
    };

    this.el = el;
    this.viewer = undefined;
    this.view(rootFile);
  }

  createViewer() {
    this.viewer = new Viewer(this.el, this.options, this.zoomValue, this.speedValue);
    return this.viewer;
  }

  view(rootFile) {
    if (this.viewer) this.viewer.clear();
    if (rootFile == null || rootFile == '') return;
    const viewer = this.viewer || this.createViewer();
    viewer.load(rootFile).catch(e => console.log(e, rootFile));
    return viewer;
  }
}

export default ViewEntity;
