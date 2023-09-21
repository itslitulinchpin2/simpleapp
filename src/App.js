import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){
  return(
    <header>
        <h1><a href="/" onClick={
          function(event){
            event.preventDefault();
            //a태그가 기본적으로 페이지 리로드하는 동작을 막음
            props.onChangeMode();
            //props로 받아온 함수를 실행시킨다.
          }
        }>{props.title}</a></h1>
      </header>
  )
}

function Nav(props){
  const lis=[]
  
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key = {t.id}>
      <a id={t.id}
        //event에서 사용할 값을 변수로 지정해 두는 것이 좋다.      
        href={'/read/'+t.id}
        onClick={ 
        function(event){
          event.preventDefault();
          props.onChangeMode(Number(event.target.id))
          //event.target은 이벤트를 발생시킨 태그, 즉 a태그를 의미한다.
         //따라서 a태그의 속성값인 id를 파라미터로 넘겨주면 된다.        
        }
      }>{t.title}</a></li>)
    //각각의 li 요소는 고유의 key값이 필요해 id값으로 설정함.
    //a 태그를 만들 때에도 중괄호를 사용한다. 문자열 붙히기 용으로 + 사용
  }
  return(
    <nav>
        <ol>
          {lis}
        </ol>
    </nav>
  )
}

function Article(props){
  return(
    <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}
function Create(props){
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={
        function(event){
          event.preventDefault();
          const title=event.target.title.value;
          const body= event.target.body.value;
          //event.target은 여기서 이벤트를 발생시킨 form태그이다.
          props.onCreate(title,body)
        
        }
        //submit하면 자동으로 페이지가 리로드되므로, 막아야한다.
      }>
        <p><input type="text" name="title" placeholder="title"></input></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="create"></input></p>
      </form>
    </article>

  )
}

function Update(props){
  const [title,setTitle]=useState(props.title)
  const [body,setBody]=useState(props.body)
  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={
        function(event){
          event.preventDefault();
          const title=event.target.title.value;
          const body= event.target.body.value;
          //event.target은 여기서 이벤트를 발생시킨 form태그이다.
          props.onUpdate(title,body)
        
        }
        //submit하면 자동으로 페이지가 리로드되므로, 막아야한다.
      }>
        <p><input type="text" name="title" placeholder="title" value={title} onChange={
          function(event){
            //console.log(event.target.value);
            //입력하는 값을 바꾼 것을 얻고싶을 때 !!
            setTitle(event.target.value)
          }
        }></input></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={
          function(event){
            setBody(event.target.value)
          }
        }></textarea></p>
        
        <p><input type="submit" value="update"></input></p>
      </form>
    </article>

  )
}

function App() {
  const [topics,setTopics] =useState( [
    {id:1, title:"html", body:"html is ..." },
    {id:2, title:"css", body:"css is ..." },
    {id:3, title:"javascript", body:"javascript is ..." }
  ])
  //topics는 객체들을 담은 배열이다.

  //const _mode = useState('WELCOME'); //초기값을 useState의 인자로 준다.
  //mode는 일반적인 지역변수인데, 상태를 만들기 위해 훅 사용.
  
  //const mode=_mode[0]; //0번째 인덱스에는 상태값
  //const setMode=_mode[1];//1번째 인덱스에는 상태를 변경시키는 함수
  //setMode를 통해 mode의 값을 바꿀 수 있다. 
  
  const [mode,setMode]=useState('WELCOME');
  //한 줄로 코딩하면 위와 같음.
  const [id,setId]=useState(null);
  const [nextId,setNextId]=useState(4);
  let content = null;
  let contextControl=null;
  
  if (mode === 'WELCOME'){
    content = <Article title="WELCOME" body="Hello, World for introducing!"></Article>
  } else if (mode === 'READ'){
    let title, body = null;
    
    for(let i=0;i<topics.length;i++){  
      if(topics[i].id===id){
        title=topics[i].title
        body=topics[i].body
      }
    }
    
    content = <Article title= {title} body={body}></Article>
    contextControl=
    <>
    <li><a href = {"/update"+id} onClick={
      function(event){
        event.preventDefault();
        setMode('UPDATE');
      }
    }>Update</a></li>
    <li><input type="button" value="Delete" onClick={
      function(){
        const newTopics=[]
        for(let i=0;i<topics.length;i++){
          if(topics[i].id!=id){
            newTopics.push(topics[i])
          }
        }
        //for문을 통해 삭제하지 않을 토픽들만 담은 새 배열을 담는다.
        setTopics(newTopics)
        setMode('WELCOME')
      }
    }></input></li>
    </>
  } else if (mode ==='CREATE'){
    content = <Create onCreate= {
      function(_title,_body){
        const newTopic={id : nextId, title:_title, body:_body}
        //이러기 위해서는 nextId 값이 미리 증가되어 있어야 함.
        const newTopics=[...topics]
        newTopics.push(newTopic);
        //배열이나 객체의 경우 useState 그대로 못쓴다. 원래의 객체를 새로 복사하고, 복사한 것을 수정하고, 수정한 것을 set함수에 넣어야함.
        setTopics(newTopics);
        setMode('READ');
        setId(nextId);
        setNextId(nextId+1);
      }
    }></Create>
  } else if (mode==='UPDATE'){
    let title, body = null;
    
    for(let i=0;i<topics.length;i++){  
      if(topics[i].id===id){
        title=topics[i].title
        body=topics[i].body
      }
    }
    //해당 id를 바탕으로 title과 body의 값을 알아옴

    content = <Update title={title} body={body} onUpdate={
      function(title,body){
        const updatedTopic={id:id,title:title, body:body}
        const newTopics=[...topics]
        for (let i=0;i<newTopics.length;i++){
          if (newTopics[i].id===id){
            newTopics[i]=updatedTopic;
            break;
          }
        }
        setTopics(newTopics)
        setMode('READ');
      
      }
    }></Update>

  }
  return (
    <div>
      <Header title="WEB" onChangeMode={
        function(){
          //alert('Header')
          setMode('WELCOME')
        }
      }></Header>

      <Nav topics={topics} onChangeMode={
        function(_id){
          //alert(id)
          setMode('READ')
          setId(_id)
        }
      }></Nav>

    {content}
    <ul>
      <li>
      <a href = "/create" onClick = {
        function(event){
          event.preventDefault();
          setMode('CREATE')
        }
      }>Create</a></li>
      {contextControl}
    </ul>
    </div>
    
  );
}
export default App;