import z from "zod";

export type FormInfo = {
    field: string;
    description: string;
    placeholder: string;
}

export const formInfo1 =[
{
    field: "name",
    description: "Name",
    placeholder: "Walt Whitman",
},
{
    field: "email",
    description: "Email",
    placeholder: "walt.w@gmail.com"
},
{
    field: "goal",
    description: "Fundraising Goal in SOL (SPL coming soon)",
    placeholder: "200"
},
{
    field: "country",
    description: "Country",
    placeholder: "Select Country"
},
{
    field: "deadline",
    description: "Campaign Deadline",
    placeholder: "MM/DD/YYYY"
},
]

export const formSchema1 = z.object({
    name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
    }),
    email: z.email("Invalid email address."),
    goal: z.coerce.number().min(0.5, {
    message: "Goal must be at least 0.5 SOL",
    }),
    country: z.string().nonempty("Must select a country"),
    deadline: z.date(),
});

export const formInfo2 =[
{
    field: "title",
    description: "Campaign Title",
    placeholder: "Help me get a new wheelchair",
},
{
    field: "story",
    description: "Campaign Story",
    placeholder: "Write your story here...",
},
{
    field: "image",
    description: "Campaign Image",
    placeholder: "Upload an image"
},
]

export const formSchema2 = z.object({
    title: z.string().min(10, {
        message: "Title must be at least 10 characters.",
        }).max(100, {
        message: "Title must be at most 100 characters.",
    }),
    story: z.string().min(50, {
        message: "Story must be at least 50 characters.",
        }).max(5000, {
        message: "Story must be at most 5000 characters.",
    }),
    image: z.instanceof(FileList).refine((files) => files.length === 1, {
        message: "Please upload an image.",
        }).refine((files) => files.item(0)?.size! <= 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB.",
        }).refine((files) => ['image/jpeg', 'image/png'].includes(files.item(0)?.type!), {
        message: "Only .jpg and .png formats are supported.",
    }),
});

