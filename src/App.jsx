import * as d3 from "d3";
import React from "react";
import { useState, useEffect } from "react";
// import "./App.css";
import "bulma/css/bulma.css";
import "bulma-extensions/bulma-slider";

function BarChart(props) {
	const fullData = props.data1;
	const [checkData, setCheckData] = useState(fullData.map(item => ({ ...item, isChecked: false })));
	const nutritionData = ["タンパク質", "脂質", "炭水化物"];

	const chartW = 500;
	const chartH = 300;
	const margin = { top: 50, bottom: 50, left: 100, right: 100 };
	const windowW = chartW + margin.left + margin.right;
	const windowH = chartH + margin.top + margin.bottom;
	const lineCol = "black";

	const [weight, setWeight] = useState(80);   //体重、入力で更新可能にする
	const [BFP, setBFP] = useState(25);         //体脂肪率
	const calcProtein = (LBM) => [LBM * 2, LBM * 3];
	const calcFat = (LBM) => [LBM * 0.67, LBM * 0.89];
	const calcCarbo = (LBM) => [LBM * 5, LBM * 6.5];

	const [userData, setUserData] = useState([[120, 180], [40.2, 60.89], [300, 390]]);
	useEffect(() => {
		const LBM = weight * (100 - BFP) / 100;  //除脂肪体重
		setUserData([calcProtein(LBM), calcFat(LBM), calcCarbo(LBM)]);
	}, [weight, BFP]);

	//入力された体重から求めたCarboの値を基準に作成している
	const barXScale = d3.scaleLinear()
		.domain([0, userData[2][1]])
		.range([0, chartW]);

	const [proteinProps, setProteinProps] = useState([]);
	const [fatProps, setFatProps] = useState([]);
	const [carboProps, setCarboProps] = useState([]);
	useEffect(() => {
		setProteinProps(checkData.filter(item => item.isChecked).map(item => item.Protein));
		setFatProps(checkData.filter(item => item.isChecked).map(item => item.Fat));
		setCarboProps(checkData.filter(item => item.isChecked).map(item => item.Carbo));
	}, checkData);

	function HandleChangeData(e) {
		setCheckData(
			checkData.map((item) =>
				(item.name === e.target.name ? ({ ...item, isChecked: !(item.isChecked) }) : item))
		);
	}

	function HandleChangeWeight(e) {
		// console.log(e.target.value);
		setWeight(e.target.value)
	}

	function HandleChangeBFP(e) {
		// console.log(e.target.value);
		setBFP(e.target.value);
	}

	const yStep = chartH / (nutritionData.length + 1);
	const barH = yStep * 0.6;
	const userH = yStep * 0.8;
	const detailW = 30;
	const detailH = 20;

	return (
		<div className="columns">
			<div className="column">
				{
					checkData.map((item, index) => {
						return (
							//<g>だとエラーになるから<React.Fragment>を使用した
							<React.Fragment key={index}>
								<label>
									<input
										type="checkbox"
										value={item.isChecked}
										name={item.name}
										onChange={HandleChangeData}
									// onChange={item.isChecked = !(item.isChecked)}
									// checked={checkedValues.includes({ item })}
									/>
									{item.name}
								</label>
								{
									<svg width={detailW * 4} height={detailH}>
										<g transform={`translate(5, 0)`}>
											<rect x="0" y="0" width={detailW} height={detailH} fill="#FF000060" />
											<text x="0" y="5" textAlign="center" dominantBaseline="hanging" fontSize="11">{item.Protein}</text>
											<g transform={`translate(${detailW + 2}, 0)`}>
												<rect x="0" y="0" width={detailW} height={detailH} fill="#00FF0060" />
												<text x="0" y="5" textAlign="center" dominantBaseline="hanging" fontSize="11">{item.Fat}</text>
												<g transform={`translate(${detailW + 2}, 0)`}>
													<rect x="0" y="0" width={detailW} height={detailH} fill="#0000FF60" />
													<text x="0" y="5" textAlign="center" dominantBaseline="hanging" fontSize="11">{item.Carbo}</text>
												</g>
											</g>
										</g>
									</svg>
								}
								<br />
							</React.Fragment>
						)
					})
				}
			</div>
			<div className="column">
				<svg width={windowW} height={windowH}>
					<g transform={`translate(${margin.left}, ${margin.top})`}>
						{/* x軸 */}
						<g transform={`translate(0, ${chartH})`}>
							<line x1="0" y1="0" x2={chartW} y2="0" stroke={lineCol} />
							{
								barXScale.ticks().map((item, index) => {
									return (
										<g key={index} transform={`translate(${barXScale(item)}, 0)`}>
											<line x1="0" y1={-chartH} x2="0" y2="5" stroke={lineCol} />
											<text x="0" y="20" textAnchor="middle">{item}</text>
										</g>
									)
								})
							}
							<g transform={`translate(${chartW}, 0)`}>
								<text x="0" y="18" textAlign="left">(単位: g)</text>
							</g>
						</g>
						{/* y軸 */}
						<g>
							<line x1="0" y1="0" x2="0" y2={chartH} stroke={lineCol} />
							{
								nutritionData.map((item, index) => {
									return (
										<g key={index} transform={`translate(0, ${(index + 1) * yStep})`}>
											<line x1="0" y1="0" x2="-5" y2="0" stroke={lineCol} />
											<text x="-10" y="0" textAnchor="end" dominantBaseline="center">{item}</text>
										</g>
									);
								})
							}
						</g>
						{/* BarChart */}
						<g transform={`translate(0, ${yStep})`}>
							<rect x="0" y={- barH / 2} width={barXScale(proteinProps.reduce((a, b) => a + b, 0))} height={barH} fill="#FF000099" />
							<rect x={barXScale(userData[0][0])} y={- userH / 2} width={barXScale(userData[0][1]) - barXScale(userData[0][0])} height={userH} fill="#FF000099" />
						</g>
						<g transform={`translate(0, ${yStep * 2})`}>
							<rect x="0" y={- barH / 2} width={barXScale(fatProps.reduce((a, b) => a + b, 0))} height={barH} fill="#00FF0099" />
							<rect x={barXScale(userData[1][0])} y={- userH / 2} width={barXScale(userData[1][1]) - barXScale(userData[1][0])} height={userH} fill="#00FF0099" />
						</g>
						<g transform={`translate(0, ${yStep * 3})`}>
							<rect x="0" y={- barH / 2} width={barXScale(carboProps.reduce((a, b) => a + b, 0))} height={barH} fill="#0000FF99" />
							<rect x={barXScale(userData[2][0])} y={- userH / 2} width={barXScale(userData[2][1]) - barXScale(userData[2][0])} height={userH} fill="#0000FF99" />
						</g>
					</g>
				</svg>
			</div>
			<div className="column">
				<label>
					体重(kg):
					<input
						type="text"
						value={this}
						onChange={HandleChangeWeight}
						placeholder="数字を入力"
					/>
				</label>
				<br />
				<label>
					体脂肪率(%):
					<input
						type="text"
						value={this}
						onChange={HandleChangeBFP}
						placeholder="数字を入力"
					/>
				</label>
				<br />
				<label>
					体重(kg):
					<input
						className="slider has-output-tooltip is-fullwidth is-info"
						step="1" min="40" max="100" value="50" type="range"
					/>
				</label>
			</div>
		</div>
	);
}

function Loading() {
	console.log("Loading...");
	return (
		<div>
			<p>Loading...</p>
		</div>
	);
}

function Title() {
	return (
		<h1 className="title">
			Let's eat BigMac!!!!!
		</h1>
	);
}

function App() {
	const [fullData, setFullData] = useState(null);
	useEffect(() => {
		fetch("/regularData.json")
			.then((response) => response.json())
			.then((jsonData) => {
				setFullData(jsonData);
			})
	}, []);

	if (fullData) {
		return (
			<div>
				<Title />
				<BarChart data1={fullData} />
			</div>
		);
	} else {
		<Loading />
	}
}
export default App;