import { off } from '../services/firebase'
import { useEffect, useState } from "react";
import { database, onValue, ref } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean,
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}


//REAPROVEITAR ALGO FUNCIONAL NA APLICAÇÃO
export function useRoom (roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [ title, setTitle ] = useState('');

  useEffect(() => {
    console.log(roomId);
    const roomRef = ref(database, `rooms/${roomId}`);

    onValue(roomRef, (room) => {
      const roomData = room.val();
      const firebaseQuestions: FirebaseQuestions = roomData.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
        return { 
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([ key,like ])=> like.authorId === user?.id)?.[0]

        }
      })

      setTitle(roomData.title);
      setQuestions(parsedQuestions);
    }, {onlyOnce: true})

    return () => {
      off(roomRef, 'value' );
    }
    
  }, [roomId, user?.id]); // ARRAY DE DEPENDÊNCIAS

  return {questions, title}
  
}