import * as d3 from "d3";
import React from "react";
import { useState, useEffect } from "react";
import "bulma/css/bulma.css";
// import "bulma-extensions/bulma-slider/dist/css/bulma-slider.min.css";

function BarChart(props) {
	const fullData = props.data1;
	const [checkData, setCheckData] = useState(fullData.map(item => ({ ...item, isChecked: false })));
	const nutritionData = ["タンパク質", "脂質", "炭水化物"];

	const chartW = 500;
	const chartH = 220;
	const margin = { top: 10, bottom: 50, left: 100, right: 100 };
	const windowW = chartW + margin.left + margin.right;
	const windowH = chartH + margin.top + margin.bottom;
	const lineCol = "black";

	const [sex, setSex] = useState(0);          //性別、男0、女1
	const [age, setAge] = useState(20);         //年齢
	const [height, setHeight] = useState(180);  //身長
	const [weight, setWeight] = useState(80);   //体重
	const [moment, setMoment] = useState(1.5);
	const [energy, setEnergy] = useState(1500); //実体重適正エネルギー
	const [baseEnergy, setBaseEnergy] = useState(1700); //標準体重適正エネルギー

	const [BFP, setBFP] = useState(25);         //体脂肪率

	// const calcProtein = (w, h) => {
	// 	return [LBM * 2, LBM * 3];
	// };
	// const calcFat = (w, h) => {
	// 	return [LBM * 0.67, LBM * 0.89];
	// };
	// const calcCarbo = (w, h) => {
	// 	return [LBM * 5, LBM * 6.5];
	// };

	const calcProtein = (LBM) => [LBM * 2 / 3, LBM * 3 / 3];
	const calcFat = (LBM) => [LBM * 0.67 / 3, LBM * 0.89 / 3];
	const calcCarbo = (LBM) => [LBM * 5 / 3, LBM * 6.5 / 3];

	const [userData, setUserData] = useState([[120, 180], [40.2, 60.89], [300, 390]]);
	useEffect(() => {
		const LBM = weight * (100 - BFP) / 100;  //除脂肪体重
		setUserData([calcProtein(LBM), calcFat(LBM), calcCarbo(LBM)]);
	}, [sex, age, height, weight]);

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

	function HandleChangeSex(e) {
		setSex(e.target.value);
	}
	function HandleChangeAge(e) {
		setAge(e.target.value);
	}
	function HandleChangeWeight(e) {
		setWeight(e.target.value);
	}
	function HandleChangeHeight(e) {
		setHeight(e.target.value);
	}
	function HandleChangeMoment(e) {
		setMoment(e.target.value);
	}
	function HandleChangeBFP(e) {
		setBFP(e.target.value);
	}

	const yStep = chartH / (nutritionData.length + 1);
	const barH = yStep * 0.6;
	const userH = yStep * 0.8;

	return (
		<div>
			<div className="columns">
				<div className="column is-half">
					<div className="columns">
						<div className="column is-half">
							<div className="control">
								<table className="table table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
									<thead>
										<tr>
											<th></th>
											<th>ハンバーガー</th>
										</tr>
									</thead>
									<tbody>
										{
											checkData.filter((item) => item.category === "humbuger").map((item, index) => {
												return (
													<React.Fragment key={index}>
														<tr>
															<th>
																<input type="checkbox"
																	value={item.isChecked}
																	name={item.name}
																	onChange={HandleChangeData} />
															</th>
															<th>{item.name}</th>
														</tr>
													</React.Fragment>
												)
											})
										}
									</tbody>
								</table>
							</div>
						</div>
						<div className="column is-half">
							<div className="control">
								<table className="table table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
									<thead>
										<tr>
											<th></th>
											<th>サイドメニュー</th>
										</tr>
									</thead>
									<tbody>
										{
											checkData.filter((item) => item.category === "sideMenu").map((item, index) => {
												return (
													<React.Fragment key={index}>
														<tr>
															<th className="is-centered">
																<input type="checkbox"
																	value={item.isChecked}
																	name={item.name}
																	onChange={HandleChangeData} />
															</th>
															<th>{item.name}</th>
														</tr>
													</React.Fragment>
												)
											})
										}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div className="column">
					<div className="column">

						<div className="field">
							<label className="radio">
								<div className="control">
									<input type="radio" name="sex" onChange={HandleChangeSex} value="0" />
									男
								</div>
							</label>
							<label className="radio">
								<div className="control">
									<input type="radio" name="sex" onChange={HandleChangeSex} value="1" />
									女
								</div>
							</label>
						</div>

						<div className="field">
							<label className="label">身長(cm):</label>
							<div className="control">
								<input
									className="slider is-fullwidth is-info"
									step="1" min="100" max="200" value={height}
									type="range"
									onChange={HandleChangeHeight}
								/>
								<output for="sliderWithValue">{height}</output>
							</div>
						</div>

						<div className="field">
							<label className="label">体重(kg):</label>
							<input
								className="slider is-fullwidth is-info"
								step="1" min="40" max="100" value={weight}
								type="range"
								onChange={HandleChangeWeight}
							/>
							<output for="sliderWithValue">{weight}</output>
						</div>

						<div className="field">
							<div className="control">
								<label className="radio">
									<input type="radio" name="moment" onChange={HandleChangeMoment} value="1.5" />
									家の中だけで過ごしており、あまり動かない
								</label>
								<br />
								<label className="radio">
									<input type="radio" name="moment" onChange={HandleChangeMoment} value="1.75" />
									通勤、買い物で外へ出る程度
								</label>
								<br />
								<label className="radio">
									<input type="radio" name="moment" onChange={HandleChangeMoment} value="2.0" />
									立ち仕事、スポーツをする程度
								</label>
							</div>
						</div>
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
									<rect x={barXScale(userData[0][0])} y={- userH / 2} width={barXScale(userData[0][1]) - barXScale(userData[0][0])} height={userH} fill="#FF000050" />
									<line x1={barXScale(userData[0][0])} y1={-userH / 2} x2={barXScale(userData[0][0])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
									<line x1={barXScale(userData[0][1])} y1={-userH / 2} x2={barXScale(userData[0][1])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
								</g>
								<g transform={`translate(0, ${yStep * 2})`}>
									<rect x="0" y={- barH / 2} width={barXScale(fatProps.reduce((a, b) => a + b, 0))} height={barH} fill="#00FF0099" />
									<rect x={barXScale(userData[1][0])} y={- userH / 2} width={barXScale(userData[1][1]) - barXScale(userData[1][0])} height={userH} fill="#00FF0050" />
									<line x1={barXScale(userData[1][0])} y1={-userH / 2} x2={barXScale(userData[1][0])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
									<line x1={barXScale(userData[1][1])} y1={-userH / 2} x2={barXScale(userData[1][1])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
								</g>
								<g transform={`translate(0, ${yStep * 3})`}>
									<rect x="0" y={- barH / 2} width={barXScale(carboProps.reduce((a, b) => a + b, 0))} height={barH} fill="#0000FF99" />
									<rect x={barXScale(userData[2][0])} y={- userH / 2} width={barXScale(userData[2][1]) - barXScale(userData[2][0])} height={userH} fill="#0000FF50" />
									<line x1={barXScale(userData[2][0])} y1={-userH / 2} x2={barXScale(userData[2][0])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
									<line x1={barXScale(userData[2][1])} y1={-userH / 2} x2={barXScale(userData[2][1])} y2={userH / 2} stroke={lineCol} strokeWidth="2" />
								</g>
							</g>
						</svg>
					</div>
					<div className="column">
						<p>
							グラフ中の枠は適正摂取量なので、枠に収まるように食べましょう
						</p>
					</div>
				</div>
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
		<div>
			<section className="hero is-small is-warning">
				<div className="hero-body">
					<p className="title is-3">
						マクドナルドPFCバランス計算
					</p>
					<p>
						1食分の適切な栄養素を計算しましょう
					</p>
					<p>
						PFCとは、タンパク質(Protein)、脂質(Fat)、炭水化物(Carbohydrates)のことです
					</p>
				</div>
			</section>
		</div>
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