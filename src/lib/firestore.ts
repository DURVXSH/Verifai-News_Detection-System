import { 
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { HistoricalAnalysis } from '@/utils/types';

export const saveAnalysis = async (userId: string, analysis: HistoricalAnalysis) => {
  try {
    const userHistoryRef = collection(db, 'users', userId, 'history');
    await addDoc(userHistoryRef, {
      ...analysis,
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
};

export const getAnalysisHistory = async (userId: string): Promise<HistoricalAnalysis[]> => {
  try {
    const userHistoryRef = collection(db, 'users', userId, 'history');
    const q = query(
      userHistoryRef,
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HistoricalAnalysis));
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }
};

export const deleteAnalysis = async (userId: string, analysisId: string) => {
  try {
    const analysisRef = doc(db, 'users', userId, 'history', analysisId);
    await deleteDoc(analysisRef);
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw error;
  }
};