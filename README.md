# Interactive Question Management Sheet

A production-grade SaaS-style web application for managing coding questions and learning resources. Inspired by **Striver's SDE Sheet**, this app provides a comprehensive platform for tracking interview prep across different difficulty levels and topics.

## 🎯 Features

### Core Functionality
- **Hierarchical Management**: Topics → Sub-topics → Questions
- **Full CRUD Operations**: Add, edit, and delete at all levels
- **Solved Tracking**: Mark questions as solved/unsolved with visual indicators
- **LocalStorage Persistence**: All changes are automatically saved locally
- **Progress Tracking**: See your progress with solved question counts and progress bars

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Search**: Global search across all questions with Ctrl+K shortcut
- **Difficulty Filter**: Filter questions by Easy, Medium, or Hard
- **Drag & Drop Ready**: Infrastructure for future DnD implementation
- **Dark-themed UI**: Clean, modern SaaS design with Tailwind CSS

### Data Management
- **Export/Import**: Download and upload sheet data as JSON
- **Reset to Default**: Restore the original Striver SDE sheet
- **API Integration**: Auto-fetches from Striver SDE API on first load
- **Data Normalization**: Converts flat API response to nested structure

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool
- **Zustand** - Global state management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **@dnd-kit** - Drag and drop (infrastructure ready)

## 📋 Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root component
├── store/
│   └── useSheetStore.js    # Zustand store with all business logic
├── components/
│   ├── Header.jsx          # Top navigation & controls
│   ├── TopicList.jsx       # Left sidebar with topics
│   ├── MainContent.jsx     # Main content area
│   ├── SubTopicAccordion.jsx # Expandable sub-topics
│   ├── QuestionCard.jsx    # Individual question card
│   ├── SearchModal.jsx     # Global search modal
│   ├── ContextMenu.jsx     # Right-click context menu
│   ├── FloatingActionMenu.jsx # Floating + button
│   ├── LoadingState.jsx    # Loading UI
│   └── ErrorState.jsx      # Error UI
├── utils/
│   └── normalizeApiSheet.js # API response normalization
└── styles/
    └── globals.css         # Global styles & animations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173` automatically.

## 📖 Usage Guide

### First Time Setup
1. On first load, the app fetches the **Striver SDE Sheet** from the public API
2. Data is automatically normalized and stored in localStorage
3. Select a topic from the left sidebar to view questions

### Managing Topics
- **Add**: Click the floating "+" button and select "New Topic"
- **Edit**: Right-click a topic → "Edit"
- **Delete**: Right-click a topic → "Delete"

### Managing Sub-topics
- **Add**: Right-click a topic → "Add Sub-topic"
- **Edit**: Right-click a sub-topic → "Edit"
- **Delete**: Right-click a sub-topic → "Delete"

### Managing Questions
- **Add**: Right-click a sub-topic → "Add Question"
- **Edit**: Right-click a question → "Edit"
- **Delete**: Right-click a question → "Delete"
- **Mark Solved**: Click the circle icon next to a question title

### Search & Filter
- **Search**: Press `Ctrl + K` or click the search icon
- **Filter by Difficulty**: Use the filter dropdown in the header

### Export & Import
- **Export**: Click the download icon to export as JSON
- **Import**: Click the upload icon to import from JSON
- **Reset**: Click the refresh icon to restore original sheet

## 🎨 UI Components

### Difficulty Badges
- **Easy** - Green badge
- **Medium** - Blue badge
- **Hard** - Red badge

### Platform Tags
- **LeetCode** - Yellow tag
- **GeeksforGeeks** - Green tag
- **Striver TUF** - Purple tag
- **InterviewBit** - Pink tag

### Progress Indicators
- Per-topic progress bars showing solved/total questions
- Visual indicators for solved questions (checkmark icons)

## 💾 LocalStorage Schema

```javascript
{
  "topics": [
    {
      "id": "topic-id",
      "title": "Arrays",
      "subTopics": [
        {
          "id": "subtopic-id",
          "title": "Two Pointers",
          "questions": [
            {
              "id": "q-id",
              "title": "Two Sum",
              "difficulty": "Easy",
              "platform": "leetcode",
              "problemUrl": "https://...",
              "resource": "https://...",
              "isSolved": false
            }
          ]
        }
      ]
    }
  ]
}
```

## 🔄 Store Actions

```javascript
// Fetch & Init
initializeSheet()
resetToDefault()

// Topics
addTopic(title)
editTopic(topicId, newTitle)
deleteTopic(topicId)

// Sub-topics
addSubTopic(topicId, title)
editSubTopic(topicId, subTopicId, newTitle)
deleteSubTopic(topicId, subTopicId)

// Questions
addQuestion(topicId, subTopicId, questionData)
editQuestion(topicId, subTopicId, questionId, updates)
deleteQuestion(topicId, subTopicId, questionId)
toggleSolved(topicId, subTopicId, questionId)

// Reordering
reorderTopics(items)
reorderSubTopics(topicId, items)
reorderQuestions(topicId, subTopicId, items)
moveQuestion(fromTopicId, fromSubTopicId, toTopicId, toSubTopicId, questionId)

// Search & Filter
setSearchQuery(query)
setDifficultyFilter(filter)
getFilteredQuestions()

// Export/Import
exportJSON()
importJSON(jsonString)

// Utils
getTopicById(topicId)
getSubTopicById(topicId, subTopicId)
getQuestionById(topicId, subTopicId, questionId)
getTopicStats(topicId)
```

## 🎯 Bonus Features Implemented

1. ✅ **Global Search** - Press Ctrl+K to search across all questions
2. ✅ **Difficulty Filter** - Filter questions by Easy/Medium/Hard
3. ✅ **Export/Import JSON** - Download and restore your progress
4. ✅ **Reset to Default** - Restore original Striver SDE sheet
5. ✅ **Keyboard Shortcuts** - Ctrl+K for search
6. ✅ **Progress Bars** - Visual progress tracking per topic

## 🔧 API Integration

The app fetches data from:
```
https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet
```

API response fields supported:
- `data.sheet.config.topicOrder` - Maintains topic order
- `data.sheet.config.questionOrder` - Maintains question order per subtopic
- `data.questions[]` - Individual question metadata

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (full-width, collapsible sidebar)
- **Tablet**: 768px - 1024px (adaptable layout)
- **Desktop**: > 1024px (full 2-column layout)

## 🚀 Performance Optimizations

- LocalStorage caching reduces API calls
- Component memoization (ready to add React.memo)
- Efficient state updates with Zustand
- CSS transitions for smooth animations
- Lazy-loaded modals

## 📝 License

Built as a learning project inspired by Striver's SDE Sheet.

## 🤝 Contributing

This is a standalone project, but feel free to fork and extend!

---

**Happy learning! 🎓**
