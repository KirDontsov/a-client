import { ref } from 'vue';

export const useSidebarState = () => {
  // Create a reactive state for sidebar expansion
  const expanded = ref(false);

  // Create a shared DOM element to track sidebar state across MFEs
  const SIDEBAR_STATE_ELEMENT_ID = 'sidebar-state-sync';
  let sidebarStateElement: HTMLElement | null = null;
  let mutationObserver: MutationObserver | null = null;

  // Function to create or get the shared state element
  const getOrCreateStateElement = () => {
    let element = document.getElementById(SIDEBAR_STATE_ELEMENT_ID);
    if (!element) {
      element = document.createElement('div');
      element.id = SIDEBAR_STATE_ELEMENT_ID;
      element.style.display = 'none';
      element.setAttribute('data-expanded', 'false');
      document.body.appendChild(element);
    }
    return element;
  };

  // Function to read the current state from the shared element or localStorage
  const getCurrentState = () => {
    if (sidebarStateElement) {
      const attrValue = sidebarStateElement.getAttribute('data-expanded');
      if (attrValue !== null) {
        return attrValue === 'true';
      }
    }

    // Fallback to localStorage
    const storedValue = localStorage.getItem('sidebar-expanded');
    return storedValue ? storedValue === 'true' : false;
  };

  // Function to update the shared state element
  const updateStateElement = (value: boolean) => {
    if (!sidebarStateElement) {
      sidebarStateElement = getOrCreateStateElement();
    }
    sidebarStateElement.setAttribute('data-expanded', value.toString());
    // Also update localStorage for persistence
    localStorage.setItem('sidebar-expanded', value.toString());
  };

  // Mutation observer callback
  const handleMutation = (mutationsList: MutationRecord[]) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-expanded') {
        const newValue = mutation.target.getAttribute('data-expanded') === 'true';
        if (expanded.value !== newValue) {
          expanded.value = newValue;
        }
      }
    }
  };

  const initialize = () => {
    // Initialize the shared state element
    sidebarStateElement = getOrCreateStateElement();

    // Set initial state based on shared element or localStorage
    expanded.value = getCurrentState();

    // Ensure the shared element reflects the current state and localStorage value
    const localStorageValue = localStorage.getItem('sidebar-expanded');
    const finalValue = localStorageValue ? localStorageValue === 'true' : expanded.value;
    expanded.value = finalValue;
    sidebarStateElement.setAttribute('data-expanded', finalValue.toString());

    // Initialize mutation observer to watch for changes from other MFEs
    mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(sidebarStateElement, {
      attributes: true,
      attributeFilter: ['data-expanded'],
    });

    // Also listen for storage events in case localStorage is changed by other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-expanded' && e.newValue !== null) {
        const newValue = e.newValue === 'true';
        if (expanded.value !== newValue) {
          expanded.value = newValue;
          updateStateElement(newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  };

  const toggleExpanded = () => {
    const newValue = !expanded.value;
    expanded.value = newValue;
    updateStateElement(newValue);
  };

  return {
    expanded,
    initialize,
    toggleExpanded,
    updateStateElement,
  };
};
