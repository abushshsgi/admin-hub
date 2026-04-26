import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ViewMode = "independent" | "salon";

export type BarberProfile = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
};

export type Service = {
  id: string;
  name: string;
  duration_min: number;
  price: number;
  is_active: boolean;
};

export type WorkingHour = {
  weekday: number; // 0..6
  open: string;
  close: string;
  closed: boolean;
};

export type Booking = {
  id: string;
  client: string;
  client_avatar: string;
  service: string;
  date: string; // "Today" | "Tomorrow" | "DD MMM"
  time: string;
  duration_min: number;
  price: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
};

export type Client = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  visits: number;
  last_visit: string;
  spent: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "booking" | "review" | "system" | "chat";
};

export type ChatMessage = {
  id: string;
  sender_kind: "BARBER" | "CLIENT";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  client: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
};

export type Review = {
  id: string;
  client: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  service: string;
};

export type Salon = {
  id: string;
  name: string;
  address: string;
  cover: string;
  rating: number;
  reviews_count: number;
  members: number;
  gallery: string[];
};

type Ctx = {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  hasSalon: boolean;
  onboardingComplete: boolean;
  profile: BarberProfile;
  services: Service[];
  workingHours: WorkingHour[];
  bookings: Booking[];
  clients: Client[];
  notifications: Notification[];
  conversations: Conversation[];
  reviews: Review[];
  salon: Salon;
  startBooking: (id: string) => void;
  completeBooking: (id: string) => void;
  markNotificationRead: (id: string) => void;
  sendChatMessage: (conversationId: string, text: string) => void;
  toggleService: (id: string) => void;
};

const BarberCtx = createContext<Ctx | null>(null);

const PROFILE: BarberProfile = {
  id: "b-001",
  name: "Jasur Karimov",
  title: "Senior Barber",
  email: "jasur@shearhq.uz",
  phone: "+998 90 123 45 67",
  avatar: "https://i.pravatar.cc/150?img=12",
  bio: "10+ yillik tajribaga ega sartarosh. Klassik va zamonaviy soch turmaklash.",
};

const SERVICES_INIT: Service[] = [
  { id: "s1", name: "Klassik soch turmaklash", duration_min: 45, price: 80000, is_active: true },
  { id: "s2", name: "Soqol olish va parvarish", duration_min: 30, price: 50000, is_active: true },
  { id: "s3", name: "Bola sochi", duration_min: 30, price: 40000, is_active: true },
  { id: "s4", name: "Royal package", duration_min: 90, price: 200000, is_active: false },
];

const WORKING_HOURS: WorkingHour[] = [
  { weekday: 0, open: "10:00", close: "18:00", closed: false },
  { weekday: 1, open: "09:00", close: "20:00", closed: false },
  { weekday: 2, open: "09:00", close: "20:00", closed: false },
  { weekday: 3, open: "09:00", close: "20:00", closed: false },
  { weekday: 4, open: "09:00", close: "20:00", closed: false },
  { weekday: 5, open: "09:00", close: "21:00", closed: false },
  { weekday: 6, open: "10:00", close: "16:00", closed: true },
];

const BOOKINGS_INIT: Booking[] = [
  {
    id: "bk1",
    client: "Sherzod A.",
    client_avatar: "https://i.pravatar.cc/150?img=14",
    service: "Klassik soch turmaklash",
    date: "Today",
    time: "10:30",
    duration_min: 45,
    price: 80000,
    status: "in_progress",
  },
  {
    id: "bk2",
    client: "Diyor R.",
    client_avatar: "https://i.pravatar.cc/150?img=15",
    service: "Soqol olish",
    date: "Today",
    time: "12:00",
    duration_min: 30,
    price: 50000,
    status: "accepted",
  },
  {
    id: "bk3",
    client: "Bekzod K.",
    client_avatar: "https://i.pravatar.cc/150?img=16",
    service: "Royal package",
    date: "Today",
    time: "14:00",
    duration_min: 90,
    price: 200000,
    status: "accepted",
  },
  {
    id: "bk4",
    client: "Abdulla M.",
    client_avatar: "https://i.pravatar.cc/150?img=17",
    service: "Klassik soch turmaklash",
    date: "Today",
    time: "09:00",
    duration_min: 45,
    price: 80000,
    status: "completed",
  },
  {
    id: "bk5",
    client: "Otabek S.",
    client_avatar: "https://i.pravatar.cc/150?img=18",
    service: "Bola sochi",
    date: "Tomorrow",
    time: "11:00",
    duration_min: 30,
    price: 40000,
    status: "accepted",
  },
  {
    id: "bk6",
    client: "Anvar T.",
    client_avatar: "https://i.pravatar.cc/150?img=19",
    service: "Soqol olish",
    date: "28 Apr",
    time: "15:30",
    duration_min: 30,
    price: 50000,
    status: "completed",
  },
];

const CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Sherzod Abdullayev",
    avatar: "https://i.pravatar.cc/150?img=14",
    phone: "+998 90 111 22 33",
    visits: 12,
    last_visit: "Today",
    spent: 960000,
  },
  {
    id: "c2",
    name: "Diyor Rahimov",
    avatar: "https://i.pravatar.cc/150?img=15",
    phone: "+998 91 222 33 44",
    visits: 8,
    last_visit: "Today",
    spent: 400000,
  },
  {
    id: "c3",
    name: "Bekzod Karimov",
    avatar: "https://i.pravatar.cc/150?img=16",
    phone: "+998 93 333 44 55",
    visits: 5,
    last_visit: "Yesterday",
    spent: 1000000,
  },
  {
    id: "c4",
    name: "Abdulla Murodov",
    avatar: "https://i.pravatar.cc/150?img=17",
    phone: "+998 94 444 55 66",
    visits: 20,
    last_visit: "Today",
    spent: 1600000,
  },
  {
    id: "c5",
    name: "Otabek Saidov",
    avatar: "https://i.pravatar.cc/150?img=18",
    phone: "+998 97 555 66 77",
    visits: 3,
    last_visit: "1 hafta",
    spent: 120000,
  },
];

const NOTIFICATIONS_INIT: Notification[] = [
  {
    id: "n1",
    title: "Yangi bron",
    body: "Sherzod Abdullayev sizga 10:30 ga bron qildi.",
    time: "5 daqiqa oldin",
    read: false,
    kind: "booking",
  },
  {
    id: "n2",
    title: "Yangi sharh",
    body: "Diyor R. sizga 5 yulduz qoldirdi.",
    time: "1 soat oldin",
    read: false,
    kind: "review",
  },
  {
    id: "n3",
    title: "To'lov qabul qilindi",
    body: "Haftalik daromad hisobingizga o'tkazildi.",
    time: "Kecha",
    read: true,
    kind: "system",
  },
  {
    id: "n4",
    title: "Yangi xabar",
    body: "Bekzod K.: 'Salom, sizda joy bormi?'",
    time: "2 kun oldin",
    read: true,
    kind: "chat",
  },
];

const CONVERSATIONS_INIT: Conversation[] = [
  {
    id: "cv1",
    client: "Sherzod Abdullayev",
    avatar: "https://i.pravatar.cc/150?img=14",
    preview: "Rahmat, ertaga keyaman.",
    time: "10:24",
    unread: 0,
    messages: [
      { id: "m1", sender_kind: "CLIENT", text: "Salom, ertaga 11:00 ga bron qila olamanmi?", time: "10:20" },
      { id: "m2", sender_kind: "BARBER", text: "Salom! Albatta, sizni kutaman.", time: "10:22" },
      { id: "m3", sender_kind: "CLIENT", text: "Rahmat, ertaga keyaman.", time: "10:24" },
    ],
  },
  {
    id: "cv2",
    client: "Bekzod Karimov",
    avatar: "https://i.pravatar.cc/150?img=16",
    preview: "Royal package ichida nima bor?",
    time: "Kecha",
    unread: 2,
    messages: [
      { id: "m4", sender_kind: "CLIENT", text: "Salom, sizda joy bormi?", time: "Kecha 18:30" },
      { id: "m5", sender_kind: "CLIENT", text: "Royal package ichida nima bor?", time: "Kecha 18:31" },
    ],
  },
  {
    id: "cv3",
    client: "Otabek Saidov",
    avatar: "https://i.pravatar.cc/150?img=18",
    preview: "Vaqt o'zgardi.",
    time: "2 kun",
    unread: 0,
    messages: [
      { id: "m6", sender_kind: "BARBER", text: "Salom Otabek, vaqtingiz 15:00 ga ko'chirildi.", time: "2 kun" },
      { id: "m7", sender_kind: "CLIENT", text: "Vaqt o'zgardi.", time: "2 kun" },
    ],
  },
];

const REVIEWS: Review[] = [
  {
    id: "r1",
    client: "Sherzod A.",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 5,
    text: "Eng zo'r usta! Hamisha ozoda va o'z vaqtida.",
    date: "2 kun oldin",
    service: "Klassik soch turmaklash",
  },
  {
    id: "r2",
    client: "Diyor R.",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    text: "Soqolni juda chiroyli oldi, tavsiya qilaman.",
    date: "1 hafta oldin",
    service: "Soqol olish",
  },
  {
    id: "r3",
    client: "Bekzod K.",
    avatar: "https://i.pravatar.cc/150?img=16",
    rating: 4,
    text: "Yaxshi, lekin biroz kutdim.",
    date: "2 hafta oldin",
    service: "Royal package",
  },
  {
    id: "r4",
    client: "Abdulla M.",
    avatar: "https://i.pravatar.cc/150?img=17",
    rating: 5,
    text: "Doim shu yerga keladi oilam.",
    date: "1 oy oldin",
    service: "Bola sochi",
  },
];

const SALON: Salon = {
  id: "sl1",
  name: "Royal Cuts Studio",
  address: "Toshkent sh., Yunusobod tumani, A. Temur ko'chasi 21",
  cover:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80",
  rating: 4.8,
  reviews_count: 248,
  members: 6,
  gallery: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
    "https://images.unsplash.com/photo-1593702288056-f173a3a4c0a4?w=800&q=80",
  ],
};

export function BarberProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("independent");
  const [services, setServices] = useState<Service[]>(SERVICES_INIT);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS_INIT);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_INIT);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS_INIT);

  const value = useMemo<Ctx>(
    () => ({
      viewMode,
      setViewMode,
      hasSalon: true,
      onboardingComplete: true,
      profile: PROFILE,
      services,
      workingHours: WORKING_HOURS,
      bookings,
      clients: CLIENTS,
      notifications,
      conversations,
      reviews: REVIEWS,
      salon: SALON,
      startBooking: (id) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "in_progress" } : b)),
        ),
      completeBooking: (id) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)),
        ),
      markNotificationRead: (id) =>
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        ),
      sendChatMessage: (conversationId, text) =>
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  preview: text,
                  time: "hozir",
                  messages: [
                    ...c.messages,
                    {
                      id: `m-${Date.now()}`,
                      sender_kind: "BARBER",
                      text,
                      time: "hozir",
                    },
                  ],
                }
              : c,
          ),
        ),
      toggleService: (id) =>
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)),
        ),
    }),
    [viewMode, services, bookings, notifications, conversations],
  );

  return <BarberCtx.Provider value={value}>{children}</BarberCtx.Provider>;
}

export function useBarberContext() {
  const ctx = useContext(BarberCtx);
  if (!ctx) throw new Error("useBarberContext must be used within BarberProvider");
  return ctx;
}

export function formatUZS(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M so'm`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K so'm`;
  return `${n} so'm`;
}
