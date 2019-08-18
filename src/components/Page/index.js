import React from 'react';
import {request} from 'antd';
import { pick, merge } from '@utils';
import {
  GRAPH_MOUSE_EVENTS,
  GRAPH_OTHER_EVENTS,
  PAGE_EVENTS,
  GRAPH_MOUSE_REACT_EVENTS,
  GRAPH_OTHER_REACT_EVENTS,
  PAGE_REACT_EVENTS,
} from '@common/constants';


class Page extends React.Component {
  page;

  get pageId() {
    return '';
  }

  config = {};

  componentDidMount() {
    this.init();
    this.bindEvent();
    this.forceUpdate();
  }

  shouldComponentUpdate(props) {
    const { data: newData } = props;
    const { data: oldData } = this.props;
    const { mode: newMode } = props.graph || {};
    const { mode: oldMode } = this.props.graph || {};

    if (newMode !== oldMode) {
      this.page.changeMode(newMode);
    }

    if (newData !== oldData) {
      this.page.read(newData);

      return true;
    }

    return false;
  }

  get graph() {
    return this.page.getGraph();
  }

  pullData() {
    const searchStr = this.obj2String({
      docid: 1002
    });
    fetch('//' + location.hostname + '/getflow?' + searchStr, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
      console.log("res: ",res);
      if(res.code == "403"){
        //this.props.history.push("/login");
        window.location.hash = "/login";
      }else{
        this.graph.read(JSON.parse(res.data));
      }
      
    })
  }

  initPage() {
    
  }

  readData() {
    const { data } = this.config;

    if (data) {
      this.page.read(data);
    }
  }

  addListener = (target, eventName, handler) => {
    if (typeof handler === 'function') target.on(eventName, handler);
  };

  init() {
    merge(this.config, this.props, {
      graph: {
        container: this.pageId,
      },
    });
    
    this.initPage();
    this.readData();
    this.pullData();
  }

  obj2String(obj, arr = [], idx = 0) {
    for (let item in obj) {
      arr[idx++] = [item, obj[item]]
    }
    return new URLSearchParams(arr).toString()
  }

  getSaveData() {
    const searchStr = this.obj2String({
      userid: 10001,
      docid: 1002,
      data: JSON.stringify(this.graph.save())
    });
    fetch('//' + location.hostname + '/saveflow', {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: searchStr
    })
    .then((res)=>{
      return res.text()
    })
    .then((res)=>{
      console.log(res)
    })
  }

  bindEvent() {
    const { addListener } = this;

    GRAPH_MOUSE_EVENTS.forEach((event) => {
      const eventName = GRAPH_MOUSE_REACT_EVENTS[event];

      addListener(this.graph, `${event}`, this.props[`on${eventName}`]);
      addListener(this.graph, `node:${event}`, this.props[`onNode${eventName}`]);
      addListener(this.graph, `edge:${event}`, this.props[`onEdge${eventName}`]);
      addListener(this.graph, `group:${event}`, this.props[`onGroup${eventName}`]);
      addListener(this.graph, `guide:${event}`, this.props[`onGuide${eventName}`]);
      addListener(this.graph, `anchor:${event}`, this.props[`onAnchor${eventName}`]);
    });

    GRAPH_OTHER_EVENTS.forEach((event) => {
      let func = this.props[GRAPH_OTHER_REACT_EVENTS[event]];
      if(event === 'afterchange'){
        func = this.getSaveData.bind(this);
      }
      addListener(this.graph, [event], func);
    });

    PAGE_EVENTS.forEach((event) => {
      addListener(this.page, [event], this.props[PAGE_REACT_EVENTS[event]]);
    });
  }

  render() {
    const { page, pageId } = this;
    const { children } = this.props;

    return (
      <div id={pageId} {...pick(this.props, ['style', 'className'])}>
        {page ? children : null}
      </div>
    );
  }
}

export default Page;
