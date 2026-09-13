import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, FileDown, Mic } from 'lucide-react';

export default function DictationSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editedText, setEditedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  const isNew = !id;

  const { data: dictation, isLoading, refetch } = useQuery({
    queryKey: ['dictation', id],
    queryFn: async () => {
      const res = await axiosClient.get(`dictations/${id}/`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (data) => (data && data.status !== 'completed' && data.status !== 'failed' ? 2000 : false),
  });

  useEffect(() => {
    if (dictation && dictation.formatted_output) {
      setEditedText(dictation.formatted_output);
    }
  }, [dictation]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      
      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveTranscript(currentTranscript);
      };
      
      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      rec.onend = () => {
        if (isRecording) {
          rec.start(); // Keep it running if we haven't manually stopped
        }
      };
      
      setRecognition(rec);
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }, [isRecording]);

  const createMutation = useMutation({
    mutationFn: async ({ template_type, raw_transcript }) => {
      const res = await axiosClient.post('dictations/', { template_type, raw_transcript });
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/dictation/${data.id}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newText) => {
      const res = await axiosClient.patch(`dictations/${id}/`, { formatted_output: newText });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dictation', id]);
      alert("Saved successfully!");
    }
  });

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
      // Send the live transcript to the backend immediately
      createMutation.mutate({ template_type: "SOAP Note", raw_transcript: liveTranscript });
    } else {
      setLiveTranscript('');
      recognition?.start();
      setIsRecording(true);
    }
  };

  const handleExport = () => {
    // Basic react PDF/DOCX export would go here, for now print window
    window.print();
  };

  if (isLoading && !isNew) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? 'New Dictation' : `Dictation ${id.substring(0,8)}`}
        </h1>
        
        {!isNew && (
          <div className="flex space-x-2">
            <button 
              onClick={() => updateMutation.mutate(editedText)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <FileDown size={18} />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {isNew ? (
        <div className="flex-1 flex gap-6">
          <div className="w-full flex flex-col items-center justify-center bg-white rounded-lg shadow border-2 border-dashed border-gray-300 p-8">
            <Mic size={64} className={`mx-auto mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {isRecording ? 'Listening...' : 'Click to Start Dictating'}
            </h3>
            
            <button 
              onClick={toggleRecording}
              disabled={createMutation.isLoading || !recognition}
              className={`mt-4 px-8 py-3 rounded-full text-white font-bold shadow-lg transition-colors ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRecording ? 'Stop & Process Note' : 'Start Live Dictation'}
            </button>
            
            {!recognition && (
              <p className="text-red-500 mt-4 text-sm">Your browser does not support Speech Recognition. Please use Chrome.</p>
            )}

            {liveTranscript && (
              <div className="mt-8 w-full max-w-2xl bg-gray-50 p-4 rounded-lg border text-left text-gray-700 text-lg">
                {liveTranscript}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6">
          <div className="w-1/3 flex flex-col bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-2">Raw Transcript</h3>
            <div className="flex-1 overflow-auto text-gray-600 whitespace-pre-wrap">
              {dictation?.status === 'transcribing' ? (
                <div className="animate-pulse">Transcribing...</div>
              ) : (
                dictation?.raw_transcript || "No transcript available."
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Status: </span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                dictation?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {dictation?.status}
              </span>
            </div>
          </div>
          
          <div className="w-2/3 flex flex-col bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-2">Formatted Document</h3>
            {dictation?.status === 'completed' || dictation?.status === 'failed' ? (
               <textarea 
               className="flex-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
               value={editedText}
               onChange={(e) => setEditedText(e.target.value)}
             />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Formatting via Omniroute API...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
