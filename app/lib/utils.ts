import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import localforage from 'localforage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ef = () => {}
export const eaf = async () => {}


export function countWeekdays(startDate: Date, endDate: Date) {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        let dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
}


  export const fetchData = async<T>(key: string, fetchFunction: () => Promise<T>, fetchRemote: boolean): Promise<T> => {
    if (!fetchRemote) {
      const cachedData = await localforage.getItem<string>(key);
      
      if (cachedData) return JSON.parse(cachedData) as T;
    }
    const data = await fetchFunction();
    await localforage.setItem(key, JSON.stringify(data));
    return data;
  };

  export const saveLocal = async<T>(key: string, data: T) => {
    await
    localforage.setItem(key, JSON.stringify(data));
  }

  export const getLocal = async<T>(key: string): Promise<T | null> => {
    const data = await localforage.getItem<string>(key);
    if (data) return JSON.parse(data) as T;
    return null;
  }

  export const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }


  export const blankActivity = Array.from({ length: 10 }, () => 0);

  
  // export const testDatabaseConnection = async (config: Database) => {
  // try {

  //   const client = new Database(config);
    
  //   await client.connect();
    
  //   // Perform a simple query to test the connection
  //   await client.query('SELECT 1');
    
  //   await client.end();
    
  //   return { success: true, message: 'Database connection successful', error: "" };
  // } catch (error) {
  //   return { 
  //     success: false, 
  //     message: 'Database connection failed', 
  //     error: error instanceof Error ? error.message : String(error) 
  //   };
  // }
  // }

export const getInitialSessions = async () => {
  const sessions = await window.db.getSessions();
  return sessions;
}