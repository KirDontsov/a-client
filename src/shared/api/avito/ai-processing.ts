import { authenticatedFetch, BACKEND_PORT } from '@/shared';

export interface AiTitleProcessingRequest {
  title: string;
  category: string;
}

export interface AiDescriptionProcessingRequest {
  description: string;
  category: string;
}

// New function that just makes the POST request to trigger title processing
// The response will be handled via WebSocket in the component
export const processAiTitle = async (request: AiTitleProcessingRequest): Promise<void> => {
  try {
    // Make the initial POST request to trigger the AI processing
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/ai_title_processing`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(request),
    }).then((res) => res.json());

    // If the initial request fails, throw an error
    if (res.status !== 'success') {
      throw new Error(res.message || 'Failed to initiate AI title processing');
    }
 } catch (e) {
    console.error('Error processing AI title:', e);
    throw e;
  }
};

// New function that just makes the POST request to trigger description processing
// The response will be handled via WebSocket in the component
export const processAiDescription = async (request: AiDescriptionProcessingRequest): Promise<void> => {
  try {
    // Make the initial POST request to trigger the AI processing
    const res = await authenticatedFetch(`${BACKEND_PORT}/api/ai_description_processing`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(request),
    }).then((res) => res.json());

    // If the initial request fails, throw an error
    if (res.status !== 'success') {
      throw new Error(res.message || 'Failed to initiate AI description processing');
    }
  } catch (e) {
    console.error('Error processing AI description:', e);
    throw e;
  }
};
