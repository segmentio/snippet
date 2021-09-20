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
  width: 120px;
  height: 60px;
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

const apiKey = process.env.WRITE_KEY
const host = process.env.HOST
const aliasName = process.env.ALIAS_NAME
const workspaceId = process.env.WORKSPACE_ID
const ajsPath = aliasName ? `/${workspaceId}/${aliasName}.min.js` : ''

const jsSnippet = min({
  ajsPath,
  apiKey,
  host,
  useHostForBundles: host !== "" && host !== 'cdn.segment.com'
})

function renderButtons() {
  const onClick = async () => {
    const log = await window.analytics.track('hello')

    const resultBox = document.createElement("div")
    resultBox.id = 'resultBox'
    resultBox.innerText = log.logger._logs.find(l => l.message === 'Delivered') ? 'success' : 'failed'
    document.body.appendChild(resultBox);
  }

  const trackButton = document.createElement('button')
  trackButton.id = 'track'
  trackButton.style = buttonStyle
  trackButton.innerText = 'TRACK'
  trackButton.onclick = onClick
  document.body.appendChild(trackButton)
}

function render() {
  // render the AJS Snippet
  const element = document.createElement('div');
  element.style = codeStyle
  element.innerHTML = jsSnippet;

  document.body.appendChild(element);

  renderButtons()
}

function loadAJS() {
  const script = document.createElement('script')
  script.innerHTML = jsSnippet

  document.head.appendChild(script)

  window.analytics.ready(function onReady() {
    const ready = document.createElement('div')
    ready.id = 'ready'
    document.body.append(ready)
  })
}

document.body.setAttribute("style", bodyStyle)
loadAJS()
render()
