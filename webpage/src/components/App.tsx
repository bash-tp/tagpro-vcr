import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import Slider, { SliderTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css'

import { AppState, Modals } from '../stores/AppState';
import * as ProfileSettings from '../utils/ProfileSettings';
import * as Textures from '../utils/Textures';
import Modal from './Modal';

import './App.css';

interface IProps {
	appState: AppState;
}

export const App = observer(class AppClass extends React.Component<IProps> {
	renderGame() {
		const { appState } = this.props;

		const eggBall = appState.isEggBall();
		const gameSrc = eggBall ? "game-egg.html" : "game.html";

		return <iframe id="game-frame" src={gameSrc} frameBorder="0" />;
	}

	renderSettings() {
		const { appState } = this.props;

		return (
			<div className="container grid-sm panel">
				<div className="panel-header">
					<div className="panel-title h5">TagPro VCR Playback Settings</div>
				</div>
				<div className="panel-body">
					<div className="columns">
						<div className="column col-6">
							<h6>Chat</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideAllChat', 'Show All Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideTeamChat', 'Show Team Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideGroupChat', 'Show Group Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideSystemChat', 'Show System Chat', false)}<br />
							<p />
							<h6>HUD</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideNames', 'Show Player Names', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideDegrees', 'Show Player Degrees', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideMatchState', 'Show Time, Score & Flags', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHidePerformanceInfo', 'Show FPS', false)}<br />
							<p />
							<h6>Video Settings</h6>
							{ProfileSettings.renderProfileCheckbox('disableParticles', 'Enable Particle Effects', false)}<br />
							{ProfileSettings.renderProfileCheckbox('forceCanvasRenderer', 'Enable WebGL Rendering', false)}<br />
							{ProfileSettings.renderProfileCheckbox('disableViewportScaling', 'Enable Viewport Scaling', true)}<br />
						</div>
						<div className="column col-6">
							<h6>EggBall</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideRaptors', 'Show Raptors', false)}<br />
							<p />
							<h6>Other</h6>
							{ProfileSettings.renderProfileCheckbox('disableBallSpin', 'Enable Ball Spin', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideTeamNames', 'Show Custom Team Names', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideFlair', 'Show Flair', false)}<br />
							<p />
							Tile Respawn Warnings:<br />
							{ProfileSettings.renderTileRespawnSelect()}
						</div>
					</div>
					<p />
					<div>
						<button className="btn centered" onClick={appState.handleSettings}>Done</button>
					</div>
				</div>
			</div>
		);
	}

	renderInfo() {
		const { appState } = this.props;

		const okButton = (
			<button className="btn btn-primary close-modal"
				onClick={appState.handleDismissModal}>Ok</button>
		);

		const failedModal =
			<Modal
				title="Invalid Recording"
				body="This file does not contain a valid TagPro VCR recording."
				stateVar={appState.modal === Modals.FAILED}
				closeHandler={appState.handleDismissModal}
				actionButton={okButton}
			/>;

		const forbiddenModal =
			<Modal
				title="Forbidden"
				body="Unable to load recordings from this URL."
				stateVar={appState.modal === Modals.FORBIDDEN}
				closeHandler={appState.handleDismissModal}
				actionButton={okButton}
			/>;

		const loadingModal =
			<Modal
				title="Please Wait"
				body="Loading..."
				stateVar={appState.modal === Modals.FETCHING}
				closeHandler={appState.handleDismissModal}
			/>;

		const launchModal =
			<Modal
				title="Ready to Play"
				body="Your recording has been loaded and is ready to play."
				stateVar={appState.modal === Modals.LAUNCH}
				closeHandler={appState.handleDismissModal}
				actionButton={this.renderStartButton()}
			/>;

		return (
			<div className="container grid-sm panel">
				<div className="panel-header">
					<div className="panel-title h5">TagPro VCR</div>
				</div>
				<div className="panel-body">
					<h6>Usage</h6>
					<ol>
						<li>
							Install the userscript:{' '}
							<a href="https://bash-tp.github.io/tagpro-vcr/tagpro-vcr.user.js">tagpro-vcr.user.js</a>.
						</li>
						<li>
							Play a game of <a href="http://tagpro.gg">TagPro</a>.
						</li>
						<li>
							Upload the recorded game here ({this.renderUploadLabel()}) and click{' '}
							{this.renderStartButton()}.
						</li>
					</ol>
					<h6>Notes</h6>
					<ul>
						<li>
							To test your TagPro userscripts here, add this @include:<br />
							<code>// @include https://bash-tp.github.io/tagpro-vcr/game*.html</code>
						</li>
						<li>
							The game is running in "spectator"-mode, so you can press <code>C</code> to center the view,
							<code>+</code>/<code>-</code> to zoom in/out etc.
							(see <a href="https://www.reddit.com/r/TagPro/wiki/gameplay#wiki_spectator">wiki</a>).
						</li>
					</ul>
					<h6>Texture Pack Selection</h6>
					<p>See <a href="https://tagpro.koalabeast.com/textures/">game</a> for available texture packs.</p>
					<div>{Textures.renderTextureSelect()}</div>
					<p />
					<button className="btn centered" onClick={appState.handleSettings}>More Settings</button>
				</div>
				{failedModal}
				{forbiddenModal}
				{loadingModal}
				{launchModal}
			</div>
		);
	}

	renderUploadLabel(label?: string) {
		return (
			<label htmlFor="file" className="btn btn-link">
				<i className="icon icon-upload" /> {label || 'Upload recording'}
			</label>
		);
	}

	renderStartButton() {
		const { appState } = this.props;

		return (
			<button
				className={classnames('btn btn-success', {
					disabled: appState.started || !appState.recording
				})}
				onClick={appState.handleStart}
			>
				Play
			</button>
		);
	}

	renderNavbarStopped() {
		const { appState } = this.props;

		const fetchClasses = classnames('form-icon', 'icon', {
			'loading': appState.fetching,
			'icon-check': appState.recordingURL && !appState.fetching && appState.urlIsValid === true,
			'icon-stop': appState.recordingURL && appState.urlIsValid === false
		});

		return (
			<div className="form-horizontal">
				{this.renderUploadLabel(appState.recordingName)}

				<span> or </span>

				<div className={classnames('input-group input-inline', { 'has-icon-right': !!appState.recordingURL })}>
					<input className="form-input" type="text" value={appState.recordingURL} onChange={appState.handleUrlChange} placeholder="Fetch from URL (http://...)" />
					{appState.recordingURL && <i className={fetchClasses} />}
				</div>
				<input id="file" type="file" accept=".ndjson,.jsonl" onChange={appState.handleFileSelect} />{' '}

				{this.renderStartButton()}
			</div>
		);
	}

	renderNavbarLoading() {
		return (
			<div className="form-horizontal">
				Loading...
			</div>
		);
	}

	renderNavbarPlaying() {
		const { appState } = this.props;

		const fmt = (t: number) => {
			if (appState.initialState === TagPro.State.NotStarted && t < appState.startPacket[0]) {
				return '-' + timeFormat(appState.firstTimePacket[2].time - (t - appState.firstTimePacket[0]));
			} else if (appState.overtimePacket && t >= appState.overtimePacket[0]) {
				return timeFormat(appState.overtimePacket[2].time + (t - appState.overtimePacket[0])) + " OT";
			} else {
				return timeFormat(appState.startPacket[2].time - (t - appState.startPacket[0]));
			}
		};

		const { Handle } = Slider;
		const handle = props => {
			const { value, dragging, index, ...restProps } = props;

			return (
				<SliderTooltip
					prefixCls="rc-slider-tooltip"
					overlay={fmt(value)}
					visible={dragging}
					placement="top"
					key={index}
				>
					<Handle value={value} {...restProps} />
				</SliderTooltip>
			);
		};

		return (
			<div className="form-horizontal">
				<span className="control">
					<Slider
						min={appState.minTS} max={appState.maxTS-(appState.maxTS % 1000)}
						value={appState.currentTS} defaultValue={appState.minTS}
						handle={handle}
						disabled={appState.finished}
						onChange={appState.handleSlider}
						onAfterChange={appState.handleSeek}
					/>
					{' '}
					<button
						className="btn" type="button"
						data-state={appState.finished ? "reload" : appState.paused ? "play" : "pause"}
						onClick={appState.handleButton}
					/>
					{' '}
					<button
						className="btn" type="button"
						data-state="stop"
						onClick={appState.handleStop}
					/>
				</span>
			</div>
		);
	}

	render() {
		const { appState } = this.props;

		return (
			<div id="container">
				<header id="header" className="navbar">
					<section className="navbar-section">
						<span>TagPro VCR</span>
					</section>
					<section className="navbar-center">
						{appState.started ? (appState.playing ? this.renderNavbarPlaying() : this.renderNavbarLoading()) : this.renderNavbarStopped()}
					</section>
					<section className="navbar-section">
						<a href="https://github.com/bash-tp/tagpro-vcr" className="btn">
							GitHub
						</a>
					</section>
				</header>

				<div id="game-container">{appState.started ? this.renderGame() : appState.settings ? this.renderSettings() : this.renderInfo()}</div>
			</div>
		);
	}
});

function timeFormat(time: number) {
	return new Date(time).toISOString().substr(14, 5);
}
