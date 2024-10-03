import React, { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { Select } from './components/ui/select';
import { Mic, MicOff, Sparkles } from 'lucide-react';

const categories = ['Work', 'Personal', 'Shopping', 'Ideas', 'Other'];
const priorities = ['High', 'Medium', 'Low'];

// Simulated AI function (replace with actual API call in production)
const analyzeWithAI = (thoughts) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = {
        topPriority: thoughts.find(t => t.priority === 'High')?.text || 'No high priority tasks',
        categorySummary: Object.fromEntries(categories.map(c => [c, thoughts.filter(t => t.category === c).length])),
        suggestionText: "Based on your thoughts, consider focusing on work tasks and delegating shopping items.",
        actionItems: [
          "Schedule time for your top priority task",
          "Review and consolidate your ideas",
          "Create a shopping list and consider online ordering"
        ]
      };
      resolve(analysis);
    }, 1000); // Simulate API delay
  });
};

const BrainDumpApp = () => {
  const [thoughts, setThoughts] = useState([]);
  const [currentThought, setCurrentThought] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addThought = (category = 'Other', priority = 'Medium') => {
    if (currentThought.trim() !== '') {
      setThoughts([...thoughts, { text: currentThought, category, priority }]);
      setCurrentThought('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentThought(transcript);
        setIsListening(false);
      };
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeWithAI(thoughts);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="container">
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4">AI-Powered Brain Dump</h1>
        <div className="flex mb-4">
          <Input
            type="text"
            value={currentThought}
            onChange={(e) => setCurrentThought(e.target.value)}
            placeholder="Enter your thought..."
            className="flex-grow mr-2"
          />
          <div className="space-y-2 md:space-y-0 md:flex md:space-x-2 text-center">
            <Button onClick={() => addThought()} className="w-full md:w-auto px-4 py-2">Add Thought</Button>
            <Button onClick={handleVoiceInput} className="mr-2">
              {isListening ? <MicOff /> : <Mic />}
            </Button>
            <Button onClick={handleAIAnalysis} disabled={isAnalyzing || thoughts.length === 0}>
              {isAnalyzing ? 'Analyzing...' : <Sparkles />}
            </Button>
          </div>

        </div>

        {aiAnalysis && (
          <Card className="mb-4 bg-green-100">
            <CardHeader>AI Analysis</CardHeader>
            <CardContent>
              <p><strong>Top Priority:</strong> {aiAnalysis.topPriority}</p>
              <p><strong>Category Summary:</strong> {Object.entries(aiAnalysis.categorySummary).map(([cat, count]) => `${cat}: ${count}`).join(', ')}</p>
              <p><strong>Suggestion:</strong> {aiAnalysis.suggestionText}</p>
              <strong>Action Items:</strong>
              <ul>
                {aiAnalysis.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div>
          {thoughts.map((thought, index) => (
            <Card key={index} className="mb-2">
              <CardContent className="p-2 flex justify-between items-center">
                <span>{thought.text}</span>
                <div>
                  <Select
                    value={thought.category}
                    onValueChange={(value) => {
                      const newThoughts = [...thoughts];
                      newThoughts[index].category = value;
                      setThoughts(newThoughts);
                    }}
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                    ))}
                  </Select>
                  <Select
                    value={thought.priority}
                    onValueChange={(value) => {
                      const newThoughts = [...thoughts];
                      newThoughts[index].priority = value;
                      setThoughts(newThoughts);
                    }}
                  >
                    {priorities.map((pri) => (
                      <Select.Option key={pri} value={pri}>{pri}</Select.Option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrainDumpApp;