import { useState, useEffect } from "react";
import { CommandPalette } from "./components/ui/cmd";
import CharacterCounter from "./CharacterCounter";
import WordCounter from "./WordCounter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  SettingsIcon,
  Sun,
  Moon,
  Computer,
  List,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { useTheme } from "./components/ui/theme-provider";
import { cn } from "./lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";

const dbName = "flowtide";
const dbVersion = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) =>
      reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("imageCache")) {
        db.createObjectStore("imageCache", { keyPath: "id" });
      }
    };
  });
};

let images = [
  "https://utfs.io/f/D6128dhWEyDgPyqUneHFAiRv7GzkQ3tZcUSmjrNd6VExw9Jh",
  "https://utfs.io/f/D6128dhWEyDgyooAV982sbnctFEejWoHDi1YUqJ3mKgNxXVp",
  "https://utfs.io/f/D6128dhWEyDgLzKDb4GNstaRSlyigdBT4Z1mYhMbVIJX8Apw",
  "https://utfs.io/f/D6128dhWEyDgof6TNeiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk",
  "https://utfs.io/f/D6128dhWEyDglUh7KeRF1iZYzrSR6Pvy4X03ebokADH9J87V",
  "https://utfs.io/f/D6128dhWEyDgGcWHOCo6rIVCyNMgwjls0UZp5JzqKLmv38AT",
  "https://utfs.io/f/D6128dhWEyDgFPCtMkqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0bN",
  "https://utfs.io/f/D6128dhWEyDgr4f66KvENtxud2o9LcAq8nvS7MUlfZIsJP3k",
  "https://utfs.io/f/D6128dhWEyDgN629iFU0LT4M6Up89rolmxAfVd3eFuZvQyEC",
  "https://utfs.io/f/D6128dhWEyDghREhMXVIjgvYrUfRZTCctk7S1q5NpaJsDXQ8",
  "https://utfs.io/f/D6128dhWEyDgX4hHi4rohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgCsIdnHXfbyhE3LuGsRM1Q9oZP0elv4nkDgpi",
  "https://utfs.io/f/D6128dhWEyDgmveMLLcxTzpRywahCdem1LBcVs457lOI0XDq",
  "https://utfs.io/f/D6128dhWEyDgvHWNnw1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb",
  "https://utfs.io/f/D6128dhWEyDgnvUEjTvXzHwgo4CriD32JdTa19yM8ZLNcqUK",
  "https://utfs.io/f/D6128dhWEyDg9CLctpa8RVfu1gx4OIi5P0XzENoc6UevLsTH",
  "https://utfs.io/f/D6128dhWEyDguIRyfpzDuFQ2svylY84Sn1mfp3dRxNrObqWU",
  "https://utfs.io/f/D6128dhWEyDgp4c8bhPYJKBSEwmnPxvIlTCQoi9cVF47afXM",
  "https://utfs.io/f/D6128dhWEyDgUuCCE5wM8WVtQaUSJGIPou6nmXpxK1RdvLrN",
  "https://utfs.io/f/D6128dhWEyDgUBAlno5wM8WVtQaUSJGIPou6nmXpxK1RdvLr",
  "https://utfs.io/f/D6128dhWEyDgjByDHSCauIRlyF5cXsTSoUEtBnD6whdYNjrK",
  "https://utfs.io/f/D6128dhWEyDguR4J5zDuFQ2svylY84Sn1mfp3dRxNrObqWUV",
  "https://utfs.io/f/D6128dhWEyDgxmWnqr9bZSe2sDFlvPu57CYfAQUtchqJz8wg",
  "https://utfs.io/f/D6128dhWEyDgOhYKF5YuBovmrawFceg0UJ1y5Z2AYiuxQkdf",
  "https://utfs.io/f/D6128dhWEyDgdjM61QwXK86uSIDEUgqpYfM9eGxV0WbCZtmv",
  "https://utfs.io/f/D6128dhWEyDg7UVSwI0AL9tjnN24fbmHDy7Ok1VJoYr6ZScP",
  "https://utfs.io/f/D6128dhWEyDgLBchCTGNstaRSlyigdBT4Z1mYhMbVIJX8Apw",
  "https://utfs.io/f/D6128dhWEyDgHe1mO6nuTewkdl6BVM5rAtpxPGIFa4fH0UWD",
  "https://utfs.io/f/D6128dhWEyDgHMYQqWnuTewkdl6BVM5rAtpxPGIFa4fH0UWD",
  "https://utfs.io/f/D6128dhWEyDgXz1wzRrohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDg4jfLbJKM8Zrop2kIEY9Dn5ePbcMLCitqmsuV",
  "https://utfs.io/f/D6128dhWEyDgJEAvt6pp9ykNzg6MU5WLjo4rXmA1COws0EPS",
  "https://utfs.io/f/D6128dhWEyDgR1XUt8J5JOc7ksyxnNmUHawrWGVS6DzThpLB",
  "https://utfs.io/f/D6128dhWEyDgyYBlEcr82sbnctFEejWoHDi1YUqJ3mKgNxXV",
  "https://utfs.io/f/D6128dhWEyDgW2f3vfYlqogbO3dBTsVQXGnieNvtfrkFAD6m",
  "https://utfs.io/f/D6128dhWEyDgdMS3uD6wXK86uSIDEUgqpYfM9eGxV0WbCZtm",
  "https://utfs.io/f/D6128dhWEyDgCeNaWvfbyhE3LuGsRM1Q9oZP0elv4nkDgpiV",
  "https://utfs.io/f/D6128dhWEyDgNJQ2BRU0LT4M6Up89rolmxAfVd3eFuZvQyEC",
  "https://utfs.io/f/D6128dhWEyDgYIy5HwBhrxmiLdCbNpEqOP2MwcaY3ujAz9S8",
  "https://utfs.io/f/D6128dhWEyDgiykp0kt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F",
  "https://utfs.io/f/D6128dhWEyDgtr29Q27Yk2j70f6F4z9pJo8DOqidQIBAyZea",
  "https://utfs.io/f/D6128dhWEyDg3buUXmsT4wRBpgx589YjAqGOEbI6cHUrvzyi",
  "https://utfs.io/f/D6128dhWEyDgiAbg1Y1t6Tzhmn9MAvpPjCxDwJIrH8RlV4L0",
  "https://utfs.io/f/D6128dhWEyDgHTUMEcnuTewkdl6BVM5rAtpxPGIFa4fH0UWD",
  "https://utfs.io/f/D6128dhWEyDgIiP4LPlbi23Qp80SgzZNnUdGJxath5BoYk9s",
  "https://utfs.io/f/D6128dhWEyDga9Doxdg3nHosRfpbYkCS2MhVPw6QZWr1yXdI",
  "https://utfs.io/f/D6128dhWEyDgZvGNWRkzZ4aTb98m0VCO1weSjMrouvUcHyf3",
  "https://utfs.io/f/D6128dhWEyDg10fj1dZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D",
  "https://utfs.io/f/D6128dhWEyDgZM5649kzZ4aTb98m0VCO1weSjMrouvUcHyf3",
  "https://utfs.io/f/D6128dhWEyDgqU31obywZVRpKX0k1mJ7SsTnjir5AQaEdhgv",
  "https://utfs.io/f/D6128dhWEyDgiJIKRVt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F",
  "https://utfs.io/f/D6128dhWEyDgIJFg4p0lbi23Qp80SgzZNnUdGJxath5BoYk9",
  "https://utfs.io/f/D6128dhWEyDgTmGMBBb2QH4PsORfG0jVebz8vgmlhxCXJqTy",
  "https://utfs.io/f/D6128dhWEyDgcKsSvqHJVK5ha7AgB43xbjIlyeo69GNS8QMp",
  "https://utfs.io/f/D6128dhWEyDgAwfiUqNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd",
  "https://utfs.io/f/D6128dhWEyDgtNb9J4U7Yk2j70f6F4z9pJo8DOqidQIBAyZe",
  "https://utfs.io/f/D6128dhWEyDgUeWY8K5wM8WVtQaUSJGIPou6nmXpxK1RdvLr",
  "https://utfs.io/f/D6128dhWEyDgaeaGaOg3nHosRfpbYkCS2MhVPw6QZWr1yXdI",
  "https://utfs.io/f/D6128dhWEyDgSyUIQJj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA",
  "https://utfs.io/f/D6128dhWEyDg7I2uo5AL9tjnN24fbmHDy7Ok1VJoYr6ZScPK",
  "https://utfs.io/f/D6128dhWEyDgJhAuVxpp9ykNzg6MU5WLjo4rXmA1COws0EPS",
  "https://utfs.io/f/D6128dhWEyDgLgdkZPGNstaRSlyigdBT4Z1mYhMbVIJX8Apw",
  "https://utfs.io/f/D6128dhWEyDgGunV0To6rIVCyNMgwjls0UZp5JzqKLmv38AT",
  "https://utfs.io/f/D6128dhWEyDgduiX8IwXK86uSIDEUgqpYfM9eGxV0WbCZtmv",
  "https://utfs.io/f/D6128dhWEyDgrZLhZjWvENtxud2o9LcAq8nvS7MUlfZIsJP3",
  "https://utfs.io/f/D6128dhWEyDgNz0GfY1U0LT4M6Up89rolmxAfVd3eFuZvQyE",
  "https://utfs.io/f/D6128dhWEyDgfR6kNY3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox",
  "https://utfs.io/f/D6128dhWEyDgGTdGzao6rIVCyNMgwjls0UZp5JzqKLmv38AT",
  "https://utfs.io/f/D6128dhWEyDghgDUgIjgvYrUfRZTCctk7S1q5NpaJsDXQ8GI",
  "https://utfs.io/f/D6128dhWEyDgfRO4Ji3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox",
  "https://utfs.io/f/D6128dhWEyDgcXPQC4HJVK5ha7AgB43xbjIlyeo69GNS8QMp",
  "https://utfs.io/f/D6128dhWEyDgyqi5Sp82sbnctFEejWoHDi1YUqJ3mKgNxXVp",
  "https://utfs.io/f/D6128dhWEyDgJE8Q1Zpp9ykNzg6MU5WLjo4rXmA1COws0EPS",
  "https://utfs.io/f/D6128dhWEyDgqL9sL3ywZVRpKX0k1mJ7SsTnjir5AQaEdhgv",
  "https://utfs.io/f/D6128dhWEyDgTlw9fb2QH4PsORfG0jVebz8vgmlhxCXJqTyE",
  "https://utfs.io/f/D6128dhWEyDgOGFmMvuBovmrawFceg0UJ1y5Z2AYiuxQkdft",
  "https://utfs.io/f/D6128dhWEyDgAbmV4aNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd",
  "https://utfs.io/f/D6128dhWEyDgiU9Z8rt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F",
  "https://utfs.io/f/D6128dhWEyDg1KqHFmZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D",
  "https://utfs.io/f/D6128dhWEyDgLd5US0GNstaRSlyigdBT4Z1mYhMbVIJX8Apw",
  "https://utfs.io/f/D6128dhWEyDgokYVhJiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk",
  "https://utfs.io/f/D6128dhWEyDgLiT6ZoQGNstaRSlyigdBT4Z1mYhMbVIJX8Ap",
  "https://utfs.io/f/D6128dhWEyDg5YelLbzMZsyzNmTrg6fCY4onbJdOX81GV9Lu",
  "https://utfs.io/f/D6128dhWEyDgX0NXLWrohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDghNlUAfIjgvYrUfRZTCctk7S1q5NpaJsDXQ8G",
  "https://utfs.io/f/D6128dhWEyDglO4aHJRF1iZYzrSR6Pvy4X03ebokADH9J87V",
  "https://utfs.io/f/D6128dhWEyDgAMDQyDNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd",
  "https://utfs.io/f/D6128dhWEyDg4WqtWZM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj",
  "https://utfs.io/f/D6128dhWEyDgi15T1ot6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F",
  "https://utfs.io/f/D6128dhWEyDgW3K0VFYlqogbO3dBTsVQXGnieNvtfrkFAD6m",
  "https://utfs.io/f/D6128dhWEyDgF8H5kJEqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0b",
  "https://utfs.io/f/D6128dhWEyDgbKtPnPx81ygt4ZMWafIGx7D5hXKuievPCw2j",
  "https://utfs.io/f/D6128dhWEyDgCdqG7ufbyhE3LuGsRM1Q9oZP0elv4nkDgpiV",
  "https://utfs.io/f/D6128dhWEyDgvPpz4v1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb",
  "https://utfs.io/f/D6128dhWEyDgoc1HEGiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk",
  "https://utfs.io/f/D6128dhWEyDgjQa0hcCauIRlyF5cXsTSoUEtBnD6whdYNjrK",
  "https://utfs.io/f/D6128dhWEyDgXxdINyrohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgrZ3ipdvENtxud2o9LcAq8nvS7MUlfZIsJP3k",
  "https://utfs.io/f/D6128dhWEyDg4QTWxzM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj",
  "https://utfs.io/f/D6128dhWEyDg4nEAlWM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj",
  "https://utfs.io/f/D6128dhWEyDgDMRnGJhWEyDguin6VpMtwF7PGLzbfvBJah1e",
  "https://utfs.io/f/D6128dhWEyDgk1UrjiLBfrMVAaOGYjgl6D5bqzN8w0TWIURH",
  "https://utfs.io/f/D6128dhWEyDgj5t18cCauIRlyF5cXsTSoUEtBnD6whdYNjrK",
  "https://utfs.io/f/D6128dhWEyDg9kRrVXa8RVfu1gx4OIi5P0XzENoc6UevLsTH",
  "https://utfs.io/f/D6128dhWEyDgsRh7JoOpbzeJNEyfZxSXg9nk4lVGrw3Lc2vR",
  "https://utfs.io/f/D6128dhWEyDgf9StBe3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox",
  "https://utfs.io/f/D6128dhWEyDgoy2oawiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk",
  "https://utfs.io/f/D6128dhWEyDgDGdP5NhWEyDguin6VpMtwF7PGLzbfvBJah1e",
  "https://utfs.io/f/D6128dhWEyDgfbYNAC3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox",
  "https://utfs.io/f/D6128dhWEyDgSfppqlnj38Q4IFcMKp2Ty07imVZ5DzWkJj9R",
  "https://utfs.io/f/D6128dhWEyDgFZtwDUqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0bN",
  "https://utfs.io/f/D6128dhWEyDgnvzPPyvXzHwgo4CriD32JdTa19yM8ZLNcqUK",
  "https://utfs.io/f/D6128dhWEyDgDlFXCdjhWEyDguin6VpMtwF7PGLzbfvBJah1",
  "https://utfs.io/f/D6128dhWEyDgX1ZM5flrohSmd1bgqzcURawVyYNpnTI6ZHF7",
  "https://utfs.io/f/D6128dhWEyDgTU68NQb2QH4PsORfG0jVebz8vgmlhxCXJqTy",
  "https://utfs.io/f/D6128dhWEyDgyJek2382sbnctFEejWoHDi1YUqJ3mKgNxXVp",
  "https://utfs.io/f/D6128dhWEyDgLgnobwGNstaRSlyigdBT4Z1mYhMbVIJX8Apw",
  "https://utfs.io/f/D6128dhWEyDg8VoytxWZkzE6wj21eODm3Rc9T80Up5lBgMFW",
  "https://utfs.io/f/D6128dhWEyDgO0oANfuBovmrawFceg0UJ1y5Z2AYiuxQkdft",
  "https://utfs.io/f/D6128dhWEyDgdMfTsPUwXK86uSIDEUgqpYfM9eGxV0WbCZtm",
  "https://utfs.io/f/D6128dhWEyDgX6WmxerohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgrZxklVbvENtxud2o9LcAq8nvS7MUlfZIsJP3",
  "https://utfs.io/f/D6128dhWEyDgrhWfapvENtxud2o9LcAq8nvS7MUlfZIsJP3k",
  "https://utfs.io/f/D6128dhWEyDgrZo5i2lvENtxud2o9LcAq8nvS7MUlfZIsJP3",
  "https://utfs.io/f/D6128dhWEyDg3h79WYsT4wRBpgx589YjAqGOEbI6cHUrvzyi",
  "https://utfs.io/f/D6128dhWEyDgA5UQPP9Nj6EKR2Bcz3sxD4SqVIW5pPCah8eF",
  "https://utfs.io/f/D6128dhWEyDgZGatISIkzZ4aTb98m0VCO1weSjMrouvUcHyf",
  "https://utfs.io/f/D6128dhWEyDgf9PnwQ3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox",
  "https://utfs.io/f/D6128dhWEyDgPymeM0wFAiRv7GzkQ3tZcUSmjrNd6VExw9Jh",
  "https://utfs.io/f/D6128dhWEyDgiAzGa9rt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0",
  "https://utfs.io/f/D6128dhWEyDgcV74h1HJVK5ha7AgB43xbjIlyeo69GNS8QMp",
  "https://utfs.io/f/D6128dhWEyDgnf7kKKXzHwgo4CriD32JdTa19yM8ZLNcqUKp",
  "https://utfs.io/f/D6128dhWEyDgbhFEmcx81ygt4ZMWafIGx7D5hXKuievPCw2j",
  "https://utfs.io/f/D6128dhWEyDgtQMTCT7Yk2j70f6F4z9pJo8DOqidQIBAyZea",
  "https://utfs.io/f/D6128dhWEyDgcKM9J3HJVK5ha7AgB43xbjIlyeo69GNS8QMp",
  "https://utfs.io/f/D6128dhWEyDgdYYjI4wXK86uSIDEUgqpYfM9eGxV0WbCZtmv",
  "https://utfs.io/f/D6128dhWEyDgMizHNHSWeD3fHMoznm16ktdqXB5P2FAvcQYr",
  "https://utfs.io/f/D6128dhWEyDg9Q11cra8RVfu1gx4OIi5P0XzENoc6UevLsTH",
  "https://utfs.io/f/D6128dhWEyDgc2pLX2HJVK5ha7AgB43xbjIlyeo69GNS8QMp",
  "https://utfs.io/f/D6128dhWEyDgX7B2egrohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgMCom0DSWeD3fHMoznm16ktdqXB5P2FAvcQYr",
  "https://utfs.io/f/D6128dhWEyDgfOu6yit3F3lNqIcvyjnSp4QJ8wLAbu6HVXko",
  "https://utfs.io/f/D6128dhWEyDgj38qusNCauIRlyF5cXsTSoUEtBnD6whdYNjr",
  "https://utfs.io/f/D6128dhWEyDgAPsh32Nj6EKR2Bcz3sxD4SqVIW5pPCah8eFd",
  "https://utfs.io/f/D6128dhWEyDgY3kOKQBhrxmiLdCbNpEqOP2MwcaY3ujAz9S8",
  "https://utfs.io/f/D6128dhWEyDgDUXx8IhWEyDguin6VpMtwF7PGLzbfvBJah1e",
  "https://utfs.io/f/D6128dhWEyDgtfJXKX7Yk2j70f6F4z9pJo8DOqidQIBAyZea",
  "https://utfs.io/f/D6128dhWEyDguIyIIynDuFQ2svylY84Sn1mfp3dRxNrObqWU",
  "https://utfs.io/f/D6128dhWEyDgoIzrOBiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk",
  "https://utfs.io/f/D6128dhWEyDgtLllhn7Yk2j70f6F4z9pJo8DOqidQIBAyZea",
  "https://utfs.io/f/D6128dhWEyDgXJKPG7rohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgnvtn3lfXzHwgo4CriD32JdTa19yM8ZLNcqUK",
  "https://utfs.io/f/D6128dhWEyDg83KSdXWZkzE6wj21eODm3Rc9T80Up5lBgMFW",
  "https://utfs.io/f/D6128dhWEyDgG9zKq9o6rIVCyNMgwjls0UZp5JzqKLmv38AT",
  "https://utfs.io/f/D6128dhWEyDg8rqmUbWZkzE6wj21eODm3Rc9T80Up5lBgMFW",
  "https://utfs.io/f/D6128dhWEyDgJmQIwFpp9ykNzg6MU5WLjo4rXmA1COws0EPS",
  "https://utfs.io/f/D6128dhWEyDgWEk2mVlYlqogbO3dBTsVQXGnieNvtfrkFAD6",
  "https://utfs.io/f/D6128dhWEyDgaK5rHJg3nHosRfpbYkCS2MhVPw6QZWr1yXdI",
  "https://utfs.io/f/D6128dhWEyDgPBLb7RFAiRv7GzkQ3tZcUSmjrNd6VExw9JhH",
  "https://utfs.io/f/D6128dhWEyDgrC8KKZvENtxud2o9LcAq8nvS7MUlfZIsJP3k",
  "https://utfs.io/f/D6128dhWEyDgGAuralo6rIVCyNMgwjls0UZp5JzqKLmv38AT",
  "https://utfs.io/f/D6128dhWEyDg3uFxb0wsT4wRBpgx589YjAqGOEbI6cHUrvzy",
  "https://utfs.io/f/D6128dhWEyDgA6rCMiNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd",
  "https://utfs.io/f/D6128dhWEyDgvsIsk01pj2S0Q8hV1swqFYn5G6r7uBtaxJRb",
  "https://utfs.io/f/D6128dhWEyDgTGvGqQb2QH4PsORfG0jVebz8vgmlhxCXJqTy",
  "https://utfs.io/f/D6128dhWEyDgXnSp7ErohSmd1bgqzcURawVyYNpnTI6ZHF7Q",
  "https://utfs.io/f/D6128dhWEyDgko99n2YLBfrMVAaOGYjgl6D5bqzN8w0TWIUR",
  "https://utfs.io/f/D6128dhWEyDgX1UfcjYrohSmd1bgqzcURawVyYNpnTI6ZHF7",
  "https://utfs.io/f/D6128dhWEyDgSYJ30pj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA",
  "https://utfs.io/f/D6128dhWEyDg1uxptMZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D",
];

const colors = [
  "#61a5c2",
  "#c8b6ff",
  "#d1495b",
  "#70a288",
  "#3ab795",
  "#ff9770",
];

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedPage, setSelectedPage] = useState("none");
  const { setTheme } = useTheme();
  const [font, setFont] = useState(localStorage.getItem("font") || "sans");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [rendered, setRendered] = useState(false);
  const [background, setBackground] = useState(
    localStorage.getItem("background") || "wallpaper"
  );
  const [changeTime, setChangeTime] = useState(
    Number(localStorage.getItem("changeTime")) || 1000 * 60 * 60 * 24
  );

  useEffect(() => {
    const loadTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readonly");
      const store = transaction.objectStore("todos");
      const request = store.getAll();

      request.onsuccess = (event) => {
        setTasks(event.target.result);
      };
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readwrite");
      const store = transaction.objectStore("todos");

      await store.clear();

      tasks.forEach((task) => {
        store.add(task);
      });
    };

    saveTasks();
  }, [tasks]);

  const toDataURL = (url) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const loadNewImage = async (setBackground) => {
    const newImage = images[Math.floor(Math.random() * images.length)];
    const dataUrl = await toDataURL(newImage);
    const now = new Date().getTime();

    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readwrite");
    const store = transaction.objectStore("imageCache");

    store.put({
      id: "background",
      url: dataUrl,
      expiry: now + changeTime,
    });

    if (setBackground) {
      setSelectedImage({ url: dataUrl });
    }
  };

  const checkCachedImage = async () => {
    setRendered(true);
    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readonly");
    const store = transaction.objectStore("imageCache");
    const request = store.get("background");

    request.onsuccess = (event) => {
      const cachedData = event.target.result;
      const now = new Date().getTime();

      if (
        (cachedData && !navigator.onLine) ||
        (cachedData && cachedData.expiry < now)
      ) {
        setSelectedImage({ url: cachedData.url });
      } else if (navigator.onLine) {
        if (cachedData) {
          setSelectedImage({ url: cachedData.url });
          loadNewImage(false);
        } else {
          loadNewImage(true);
        }
      }
    };
  };

  useEffect(() => {
    if (!rendered) {
      if (background === "color") {
        setRendered(true);
      } else {
        checkCachedImage();
      }
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [rendered]);

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white bg-cover font-sans transition-background-image",
        font === "serif" && "font-serif",
        font === "monospace" && "font-mono"
      )}
      style={{
        backgroundImage: `url(${
          selectedImage.url ||
          (background == "wallpaper"
            ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA1wMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAIBABAQEAAQQDAQEAAAAAAAAAAAERMRIhQVECYXEikf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDh0OBAavyvtEABUAUAJc4LbeUAVFAQFAWfKzyyA1ylRQQVAF4EBrqvipyiggoCCwBBQEBQFl+p/iWoC1BewIKAizsIDd+W+GUXQQXlAAUCXPC9TIAKAgKBF1NQGr3GQBZnkQGr0sigguIACzAWZ5LnhkAFAQFwEanSlQFqKAgACzPJgDX84zeeyKCCoAAAKgAAKvTvmIgLmVFMBAAUncwBenJuxEXsCAAAoEm+lvxzzEQAXsAgAKs+O+UALMBAWU5Dj9Ay+qL1VKCAAAApx4Jc4Xd5BKgAAAumX0eFnysBOC03f0BAAFReAMvqi9VTkEAAABagAKgC8osa6vwGQvdAAAU8Is7UEVer8QBAAWIAtFlz0b9QERUAABUXFlwEFt0BBFgIq3p+2QVAAVAFFmeS54BEABUAURr+fsEC541AAAXRFgIuNfz9s36A1AAABRAFEAXEGunQReEvZAVABeRF5BFxentygAgCiAAsmrfjnkENQAVAFxFXp3yDItmAGINcgyLl9GgCALCxFlBBcAMDUBYIAqLpl9AinAAgAqCgguX0cAYgAogAs5AFvyvtkAAAAAWWzhbbeQBkAAABqW+wBLygAAAAA1tk5ZAAAAAH/9k="
            : "")
        })`,
        backgroundColor:
          background === "color"
            ? colors[Math.floor(Math.random() * colors.length)]
            : "#000000",
        transition: "background-image 1s ease-in-out",
      }}
      id="app"
    >
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className="text-7xl font-bold clock select-none text-shadow-lg"
        style={{ color: "#FFFFFF" }}
      >
        {time.toLocaleTimeString(undefined, options)}
      </h1>
      {selectedPage === "character-counter" && (
        <CharacterCounter setSelectedPage={setSelectedPage} />
      )}
      {selectedPage === "word-counter" && (
        <WordCounter setSelectedPage={setSelectedPage} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="fixed bottom-0 left-0 z-50 m-4">
          <Button variant="outline" aria-label="Settings" size="icon">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "w-56 ml-4",
            font === "serif" && "font-serif",
            font === "monospace" && "font-mono"
          )}
        >
          <DropdownMenuLabel>Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setTheme("dark");
              localStorage.setItem("theme", "dark");
            }}
          >
            <Moon />
            <span>Dark theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
              localStorage.setItem("theme", "light");
            }}
          >
            <Sun />
            <span>Light theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("system");
              localStorage.setItem("theme", "system");
            }}
          >
            <Computer />
            <span>System default</span>
          </DropdownMenuItem>
          <br />
          <DropdownMenuLabel>Font</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setFont("sans");
              localStorage.setItem("font", "sans");
            }}
          >
            Sans
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFont("monospace");
              localStorage.setItem("font", "monospace");
            }}
          >
            Monospace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFont("serif");
              localStorage.setItem("font", "serif");
            }}
          >
            Serif
          </DropdownMenuItem>
          <DropdownMenuLabel>Background</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setBackground("wallpaper");
              localStorage.setItem("background", "wallpaper");
              window.location.reload();
            }}
          >
            Wallpaper
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setBackground("color");
              localStorage.setItem("background", "color");
              window.location.reload();
            }}
          >
            Color Palette
          </DropdownMenuItem>
          <DropdownMenuLabel>Change photo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setChangeTime(Infinity);
              localStorage.setItem("changeTime", Infinity);
              window.location.reload();
            }}
          >
            Never
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setChangeTime(0);
              localStorage.setItem("changeTime", 0);
              window.location.reload();
            }}
            checked={background === 0}
          >
            As soon as possible
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setChangeTime(1000 * 60 * 60);
              localStorage.setItem("changeTime", 1000 * 60 * 60);
              window.location.reload();
            }}
          >
            Every hour
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setChangeTime(1000 * 60 * 60 * 24);
              localStorage.setItem("changeTime", 1000 * 60 * 60 * 24);
              window.location.reload();
            }}
          >
            Every day
          </DropdownMenuItem>
          <DropdownMenuLabel>More</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open("https://tally.so/r/3NB8vj");
            }}
          >
            Suggest a feature
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild className="fixed bottom-0 right-0 z-50 m-4">
          <Button variant="outline" aria-label="Settings" size="icon">
            <List className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-80 mr-4 max-h-[70vh] overflow-y-auto",
            font === "serif" && "font-serif",
            font === "monospace" && "font-mono"
          )}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold leading-none">To-do list</h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks here.
              </p>
            </div>
            <div id="tasks">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => {
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: checked } : t
                          )
                        );
                      }}
                    />
                    <span
                      className="text-sm font-medium leading-none select-none focus-within:select-all outline-none"
                      onDoubleClick={(e) => {
                        e.target.contentEditable = "true";
                        e.target.focus();
                      }}
                      onBlur={(e) => {
                        e.target.contentEditable = "false";
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, text: e.target.innerText }
                              : t
                          )
                        );
                      }}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTaskInput(task.text);
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
              />
              <Button
                onClick={() => {
                  if (taskInput.trim() !== "") {
                    setTasks((tasks) => [
                      ...tasks,
                      { id: Date.now(), text: taskInput, completed: false },
                    ]);
                    setTaskInput("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default App;
