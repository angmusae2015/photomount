import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import axios from 'axios';
import './App.css'


async function requestSiteList () {
  return await axios.get('http://127.0.0.1:5000/site')
    .then(response => {
      var data = response.data;

      return data;
  }).then(data => {
      for (var setState of arguments) {
        setState(data);
      }

      return 0;
  })
}


const App = () => {
  const [siteList, setSiteList] = useState({});
  const [siteSearchResult, setSiteSearchResult] = useState({});
  const [selectedSiteId, setSelectedSiteId] = useState(0);

  useEffect(() => {
    requestSiteList(setSiteList, setSiteSearchResult);
  }, []);

  function TextEditBar (props) {
    return (
      <div class="TextEditBarField">
        <input class="TextEditBar" placeholder={props.placeholder} onChange={event => {
            props.eventHandler(event);
          }
        }>
        </input>
        <div class="TextEditBarLine"></div>
      </div>
    );
  }

  function Tab(props) {
    var tabs = props.values.map((value) => {
      return (
        <div class="clickable tab" onClick={(event) => {
            event.target.style.backgroundColor = "white";
            event.target.style.borderBottom = "none";
          }
        }>{value}</div>
      )
    })

    return (
      <div class="tabBar">
        {tabs}
      </div>
    )
  }

  function Menubar () {
    return (
      <div id="menubar">
        <div id="currentTitle">
          <Routes>
            <Route exact path="/" element="환영합니다!"></Route>
            <Route exact path="/photomount" element="사진 대지 열람"></Route>
            <Route exact path="/site" element="현장 관리"></Route>
          </Routes>
        </div>
      </div>
    );
  }

  function Sidebar (props) {
    var SidebarButton = (props) => {
      return (
        <div class="SidebarMenuButton clickable">
          <div class="ButtonName">{props.name}</div>
        </div>
      );
    }

    return (
      <div id="sidebar">
        <div id="account"></div>

        <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
          <SidebarButton name="홈으로"></SidebarButton>
        </Link>

        <Link to="/photomount" style={{textDecoration: 'none', color: 'black'}}>
          <SidebarButton name="사진 대지 열람"></SidebarButton>
        </Link>

        <Link to="/site" style={{textDecoration: 'none', color: 'black'}}>
          <SidebarButton name="현장 관리"></SidebarButton>
        </Link>
      </div>
    );
  }

  function IndexContent () {
    return (
      <div class="content" id="indexContent">
        <h1>최근 열람</h1>
        <div class="cell" id="recentOpen"></div>
        <h1>최근 기록</h1>
        <div class="cell" id="recentRecord"></div>
      </div>
    );
  }

  function OpenPhotomountContent () {
    return (
      <div class="content" id="openPhotomountContent">
      </div>
    );
  }

  function SiteManagingContent () {

    function AutoComplete (props) {
      return (
        <div class="autoComplete clickable" onClick={event => {
            setSelectedSiteId(props.id);
          }
        }>
          {siteList[props.id]['name']}
        </div>
      );
    }

    function SiteEditingContent (props) {
      if (selectedSiteId == 0) {
        return (
          <div class="contentInCell" id="siteEditingContent">
            <h1>현장을 선택해주세요!</h1>
          </div>
        )
      } else {
        return (
          <div class="contentInCell" id="siteEditingContent">
            <TextEditBar placeholder={siteList[selectedSiteId]['name']}></TextEditBar>
            <div id="siteMenuEditing">

              <Tab values={["작업 내용", "작업 위치", "작업자"]}></Tab>
            </div>
          </div>
        );
      }
    }

    return (
      <div class="content" id="siteManagingContent">
        <TextEditBar placeholder="현장명 검색" eventHandler={(event) => {
            var searchResult = {};
            var keyword = event.target.value.replaceAll(" ", '').toLowerCase();

            for (var id in siteList) {
              if (siteList[id]['name'].toLowerCase().replaceAll(" ", '').includes(keyword)) {
                searchResult[id] = siteList[id];
              }
            }

            setSiteSearchResult(searchResult);
          }
        }>
        </TextEditBar>
        <div class="cell" id="searchList">
          {Object.keys(siteSearchResult).map((key) => {
            return (
              <AutoComplete id={key}></AutoComplete>
            )})
          }
        </div>
        <div class="cell" id="workPlane">
          <SiteEditingContent></SiteEditingContent>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div id="app">
        <Menubar></Menubar>
        <Sidebar></Sidebar>

        <Routes>
          <Route exact path="/" element=<IndexContent />></Route>
          <Route path="/photomount" element=<OpenPhotomountContent />></Route>
          <Route path="/site" element=<SiteManagingContent />></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
