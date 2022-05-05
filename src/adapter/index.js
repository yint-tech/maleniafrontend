import React, { useState, createContext, useEffect } from "react";
import moment from 'moment';
import apis from 'apis';
export const AppContext = createContext({});

const Adpater = (props) => {
  const [user, setUser] = useState({});
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let u = apis.getStore();
    setUser({
      ...u,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    });
    const getInfo = () => {
      apis.getUser().then(res => {
        if (res.status === 0) {
          u = {
            ...apis.getStore(),
            ...res.data,
            time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          };
          apis.setStore(u);
          setUser(u);
        }
      }).catch(() => {});
      apis.notice().then(res => {
        if (res.status === 0) {
          setNotice(res.data);
        }
      }).catch(() => {});
    }
    getInfo();
    let timer = setInterval(() => {
      getInfo();
    }, 60 * 1000);
    return () => {
      timer && clearInterval(timer);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, notice }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default Adpater;
