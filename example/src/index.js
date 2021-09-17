import { max } from '../../lib/index';

const codeStyle = `
  background-color:powderblue;
  font-family:monospace;
  background: #ffeff0;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: .1rem .3rem .2rem;
  border-radius: .2rem;
  width: 50%;
  font-size: 20px;
  margin-right: 3%;
`

const buttonStyle = `
  padding: 15px;
`

const bodyStyle = `
  padding-top: 2%;
  display: flex;
  justify-content: center;
  --featured-img: linear-gradient(180deg,#fff,#262626);
  background-color: #262626;
  background-image: radial-gradient(50% 50% at top center,rgba(0,0,0,.66),#262626),var(--featured-img);
  background-size: 120% 2000px,100% 2000px;
`

const buttons = `
  <div id="buttons">
    <button type="button" style="${buttonStyle}" id="track" onClick="window.analytics.track('hello')"> Track </button>
    <button type="button" style="${buttonStyle}" id="identify" onClick="window.analytics.identify('hello')"> Identify </button>
  </div>
`

const jsSnippet = max({
  ajsPath: "",
  apiKey: "<ADD YOUR WRITE KEY HERE>",
  host: "cdn.segment.com"
})

function render() {
  // render the AJS Snippet
  const element = document.createElement('div');
  element.setAttribute('style', codeStyle)
  element.innerHTML = jsSnippet;

  document.body.appendChild(element);


  // render track and identify buttons
  const buttonsDiv = document.createElement('div')
  buttonsDiv.innerHTML = buttons

  document.body.appendChild(buttonsDiv)
}

function loadAJS() {
  const script = document.createElement('script')
  script.innerHTML = jsSnippet

  document.head.appendChild(script)

  window.analytics.ready(function onReady() {
    console.log('ready!')
  })
}

document.body.setAttribute("style", bodyStyle)
render()
loadAJS()
