import { useHistory, useParams } from 'react-router-dom';

import  logoImg  from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';

import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database, ref, remove, update } from '../services/firebase';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { title, questions } = useRoom(roomId);

  console.log(questions);

  async function handleEndRoom () {
    await update(ref(database, `rooms/${roomId}`), { 
      endedAt: new Date()
    })

    history.push('/');

  }
  
  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`);
      await update(questionRef, { 
        isAnswered: true
      });
  }

  async function handleHighLightQuestion (questionId: string) {
    const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`);
      await update(questionRef, { 
        isHighlighted: true
      });
  }

  async function handleDeleteQuestion (questionId: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta ?')) {
      const questionRef = await ref(database, `rooms/${roomId}/questions/${questionId}`);
      await remove(questionRef);

    }
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <div>
          <RoomCode code={params.id}/>      
          <Button 
          isOutlined
          onClick={handleEndRoom}>Encerrar Sala</Button>  
          </div>

        </div>
       
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          { questions.length > 0 && <span>{questions.length} Perguntas</span>}
        </div>

        <div className="question-list">
        {questions.map(question => {
          return (
            <Question
            key ={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighLighted={question.isHighLighted}
            >
              {!question.isAnswered && (
                <>
                 <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                 >
                   <img src={checkImg} alt="Marcar pergunta como respondida." />
                 </button>
                
                 <button
                  type="button"
                  onClick={() => handleHighLightQuestion(question.id)}
                 >
                   <img src={answerImg} alt="Dar destaque à pergunta" />
                 </button>
                </>
              )}
               
              <button
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          )
        })}
        </div>
      </main>
    </div>
  );
}