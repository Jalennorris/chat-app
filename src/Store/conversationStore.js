import create from 'zustand';

const useConversationStore = create((set) => ({
  clickedConversationId: null,
  setClickedConversationId: (id) => set({ clickedConversationId: id }),
}));

export default useConversationStore;

