import React from "react";
import ReactDOM from "react-dom";

import { Chart } from "react-charts";

import useDemoConfig from "./useDemoConfig";
import useLagRadar from "./useLagRadar";
import ResizableBox from "./ResizableBox";
import "./styles.css";

export default class App  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSeriesIndex: -1,
      activeDatumIndex: -1,
    };
  }   
  
  
  render() {
    const {
      activeSeriesIndex, 
      activeDatumIndex,
    } = this.state;

    const setState = newState => this.setState(newState);

    return (
      <div>
        {JSON.stringify({ activeSeriesIndex, activeDatumIndex }, null, 2)}
        <MyChart
          elementType="line"
          setState={setState}
          activeDatumIndex={activeDatumIndex}
          activeSeriesIndex={activeSeriesIndex}
        />
        <MyChart
          elementType="area"
          setState={setState}
          activeDatumIndex={activeDatumIndex}
          activeSeriesIndex={activeSeriesIndex}
        />
        <MyChart
          elementType="bar"
          setState={setState}
          activeDatumIndex={activeDatumIndex}
          activeSeriesIndex={activeSeriesIndex}
        />
      </div>
    );
  }
}

const MyChart = props => {
  useLagRadar();
  // const { data, grouping, randomizeData } = useDemoConfig({
  const demoConfig = useDemoConfig({
    series: 4,
    height: 200,
    grouping: "primary",
    dataType: "ordinal",
    show: ["elementType", "grouping"]
  });
  return (
    <MyChartInner 
      {...demoConfig}
      {...props}
    />
  );
}

class MyChartInner extends React.Component {
  constructor(props) {
    super(props);
  }    

  render() {
    const {
      elementType,
      activeDatumIndex,
      activeSeriesIndex,
      setState
    } = this.props; 

    //useLagRadar();

    
    const { data, grouping, randomizeData } = this.props;
  

    const series = {
      type: elementType
    };

    const axes = [
      {
        primary: true,
        type: "ordinal",
        position: "bottom"
      },
      {
        type: "linear",
        position: "left",
        stacked: true
      }
    ];

    const getSeriesStyle = 
      series => ({
        color: `url(#${series.index % 4})`,
        opacity:
          activeSeriesIndex > -1
            ? series.index === activeSeriesIndex
              ? 1
              : 0.3
            : 1
      });

    const getDatumStyle = 
      datum => ({
        r:
          activeDatumIndex === datum.index &&
          activeSeriesIndex === datum.seriesIndex
            ? 7
            : activeDatumIndex === datum.index
            ? 5
            : datum.series.index === activeSeriesIndex
            ? 3
            : datum.otherHovered
            ? 2
            : 2
      });

    const onFocus = 
      focused =>
        setState({
          activeSeriesIndex: focused ? focused.series.id : -1,
          activeDatumIndex: focused ? focused.index : -1
        });

    return (
      <>
        <button onClick={randomizeData}>Randomize Data</button>
        <br />
        <br />
        <ResizableBox>
          <Chart
            data={data}
            grouping={grouping}
            series={series}
            axes={axes}
            getSeriesStyle={getSeriesStyle}
            getDatumStyle={getDatumStyle}
            onFocus={onFocus}
            tooltip
            renderSVG={() => (
              <defs>
                <linearGradient id="0" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#17EAD9" />
                  <stop offset="100%" stopColor="#6078EA" />
                </linearGradient>
                <linearGradient id="1" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#FCE38A" />
                  <stop offset="100%" stopColor="#F38181" />
                </linearGradient>
                <linearGradient id="2" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#42E695" />
                  <stop offset="100%" stopColor="#3BB2B8" />
                </linearGradient>
                <linearGradient id="3" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#F4Ea0A" />
                  <stop offset="100%" stopColor="#df4081" />
                </linearGradient>
              </defs>
            )}
          />
        </ResizableBox>
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
