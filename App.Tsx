import { useState, useMemo } from "react";

const NAV = [
  { key:"read",          icon:"🐚", label:"Read Contract" },
  { key:"pending",       icon:"🌊", label:"Pending Deal" },
  { key:"cleartoclosed", icon:"⭐", label:"Clear to Closed", indent:true },
  { key:"due",           icon:"🦀", label:"Due Dates" },
  { key:"closed",        icon:"🌸", label:"Closed Contact" },
  { key:"terminated",    icon:"🪸", label:"Terminated Contract" },
];

const RF = { name:"Reputation First Title", escrow:"Ronda Flourre", email:"rflourre@rftitle.com", phone:"734-432-0100" };

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const daysUntil = ds => { if(!ds) return null; const d=new Date(ds); d.setHours(0,0,0,0); return Math.round((d-TODAY)/86400000); };
const urgColor = days => { if(days===null) return "#94a3b8"; if(days<0) return "#ef4444"; if(days<=2) return "#f97316"; if(days<=7) return "#eab308"; return "#22c55e"; };
const matchSearch = (d,q) => { if(!q) return true; const s=q.toLowerCase(); return [d.buyers,d.sellers,d.propertyAddress,d.buyerAgent,d.listingAgent,d.lender,d.purchasePrice,d.side].some(f=>f&&f.toLowerCase().includes(s)); };

const PRELOADED = [
  {id:"p1",status:"pending",side:"Both Sides",propertyAddress:"18522 Koester St, Riverview, MI 48193",buyers:"Jennifer Drab",sellers:"Jennifer Drab",buyerAgent:"Saed Kakish",listingAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgentCompany:"Golden Key Realty Group",purchasePrice:"$164,000",emdAmount:"$0",emdHolder:"Reputation First",loanType:"FHA",lender:"One Stop Financial Group",acceptanceDate:"4/20/2026",emdDueDate:"N/A",financingDeadline:"TBD",inspectionDeadline:"4/25/2026",closeDate:"5/18/2026",commissionListing:"1.0",commissionBuyer:"1.0",complianceFee:"695",sellerTitleCompany:"Reputation First Title",buyerTitleCompany:"Reputation First Title",sellerEscrowOfficer:"Ronda Flourre",buyerEscrowOfficer:"Ronda Flourre",sellerEscrowEmail:"rflourre@rftitle.com",buyerEscrowEmail:"rflourre@rftitle.com",sellerEscrowPhone:"734-432-0100",buyerEscrowPhone:"734-432-0100",notes:"Inspection waived. Appraisal ordered"},
  {id:"p2",status:"pending",side:"Seller Side",propertyAddress:"19610 Norwood St, Detroit, MI 48234",sellers:"Faik Xhaferaj",buyers:"",listingAgent:"Arash Goneh-Farahan",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Alonia Wheeler",buyerAgentCompany:"KW Metro",purchasePrice:"$125,000",emdAmount:"$1,200",emdHolder:"Alonia Wheeler KW Metro",loanType:"FHA",lender:"Citizens Bank",acceptanceDate:"4/23/2026",emdDueDate:"N/A",financingDeadline:"5/23/2026",inspectionDeadline:"4/28/2026",closeDate:"5/26/2026",commissionListing:"3.0",complianceFee:"595",sellerTitleCompany:"Michigan Title",notes:"Send Inspection and appraisal email"},
  {id:"p3",status:"pending",side:"Buyer Side",propertyAddress:"14715 Holly Ct, Shelby Township, MI 48315",buyers:"Michael Burgess",sellers:"Wilkins Diane Trust",buyerAgent:"Triston Dadou",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Dayna Abraham",listingAgentCompany:"EXP Realty LLC",purchasePrice:"$280,000",emdAmount:"$2,000",emdHolder:"Reputation First",loanType:"VA",lender:"Ease Mortgage",acceptanceDate:"5/14/2026",emdDueDate:"05/16/2026",financingDeadline:"6/13/2026",inspectionDeadline:"5/24/2026",closeDate:"6/12/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p4",status:"pending",side:"Seller Side",propertyAddress:"590 Jared Drive, Pontiac, MI 48342",sellers:"David Vuktilaj",buyers:"Cara Mossington",listingAgent:"Arash Goneh-Farahan",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Cara Mossington",buyerAgentCompany:"Keller Williams Paint Creek",purchasePrice:"$351,500",emdAmount:"$5,000",emdHolder:"Primary Title",loanType:"Conventional",lender:"Rocket Mortgage",acceptanceDate:"5/18/2026",emdDueDate:"05/28/2026",financingDeadline:"8/16/2026",inspectionDeadline:"Waived",closeDate:"12/31/2026",commissionListing:"100.0",complianceFee:"595",sellerTitleCompany:"Primary Title",notes:"New Construction"},
  {id:"p5",status:"pending",side:"Buyer Side",propertyAddress:"15228 Yale Drive Unit 257, Clinton Charter Township, MI 48038",buyers:"Hanz Shamoon",sellers:"Andrea Moussa",buyerAgent:"Revan Hermiz",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Dave Akery",listingAgentCompany:"John Graham Realty LLC",purchasePrice:"$229,900",emdAmount:"$5,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"McLellan Financial Mortgage",acceptanceDate:"5/18/2026",emdDueDate:"05/21/2026",financingDeadline:"6/17/2026",inspectionDeadline:"5/25/2026",closeDate:"6/18/2026",commissionBuyer:"3.0",complianceFee:"895",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p6",status:"pending",side:"Buyer Side",propertyAddress:"27526 Bridle Hills Drive, Farmington Hills 48336",buyers:"Tianna Jefferson",sellers:"Gaile Conoway",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Darian Moore",listingAgentCompany:"KW Professionals",purchasePrice:"$399,900",emdAmount:"$4,000",emdHolder:"Reputation First",loanType:"FHA",lender:"Independence Home Loans",acceptanceDate:"5/20/2026",emdDueDate:"05/22/2026",financingDeadline:"6/19/2026",inspectionDeadline:"5/25/2026",closeDate:"6/19/2026",commissionBuyer:"3.0",complianceFee:"695",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Inspection Done. CTC 6/17 3PM"},
  {id:"p7",status:"pending",side:"Seller Side",propertyAddress:"1277 Liza Blvd Unit 10, Pontiac, MI 48342",sellers:"David Vuktilaj",buyers:"Charles Holmes",listingAgent:"Arash Goneh-Farahan",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Marianne Tucker",buyerAgentCompany:"The Brand Real Estate",purchasePrice:"$350,000",emdAmount:"$5,000",emdHolder:"The Brand Real Estate",loanType:"FHA",lender:"Pennymac Loan Services",acceptanceDate:"5/20/2026",emdDueDate:"05/22/2026",inspectionDeadline:"Waived",closeDate:"12/30/2026",commissionListing:"2.0",complianceFee:"595",sellerTitleCompany:"TBD",notes:"New Construction active construction site"},
  {id:"p8",status:"pending",side:"Buyer Side",propertyAddress:"1570 Michigan Avenue, Marysville, MI 48040",buyers:"Planet Wheels and Tires Inc.",sellers:"Michael P. Petrella",buyerAgent:"Revan Hermiz",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Cory Shivers",purchasePrice:"$140,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Cash",acceptanceDate:"5/24/2026",emdDueDate:"05/31/2026",financingDeadline:"N/A",inspectionDeadline:"6/23/2026",closeDate:"7/8/2026",commissionBuyer:"3.0",complianceFee:"895",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"30 day inspection period"},
  {id:"p9",status:"pending",side:"Buyer Side",propertyAddress:"1291 Courtney Court, Hartland Township, MI 48353",buyers:"Christopher Groat and Sandra Groat",sellers:"Lisa Miller",buyerAgent:"Valbona Vulaj",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Mick I. Khzouz",listingAgentCompany:"Clients First REALTORS",purchasePrice:"$600,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Cash",acceptanceDate:"5/25/2026",emdDueDate:"05/27/2026",financingDeadline:"N/A",inspectionDeadline:"6/1/2026",closeDate:"6/30/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p10",status:"pending",side:"Seller Side",propertyAddress:"259 Sisson Street, Romeo, MI 48065",sellers:"Brittani Dodd",buyers:"Timothy Cook and Corrina McCowan",listingAgent:"Triston Dadou",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Alan Blach",buyerAgentCompany:"Preferred Realtors Ltd",purchasePrice:"$270,000",emdAmount:"$3,000",emdHolder:"Title One",loanType:"Conventional",lender:"UWIN Home Loans LLC",acceptanceDate:"5/25/2026",emdDueDate:"05/27/2026",financingDeadline:"6/23/2026",inspectionDeadline:"5/31/2026",closeDate:"6/26/2026",commissionListing:"3.0",complianceFee:"595",sellerTitleCompany:"Title One",notes:"Order the appraisal 6/3"},
  {id:"p11",status:"pending",side:"Buyer Side",propertyAddress:"5212 Applewood Dr, Ypsilanti, MI 48197",buyers:"Rachael and Alan Escareno",sellers:"Logan Dybdahl",buyerAgent:"Kayla Strait",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Sara Maddock",listingAgentCompany:"@properties Christies Intl",purchasePrice:"$290,000",emdAmount:"$2,900",emdHolder:"Reputation First",loanType:"Conventional",lender:"DFCU Financial",acceptanceDate:"5/24/2026",emdDueDate:"05/26/2026",financingDeadline:"6/23/2026",inspectionDeadline:"5/31/2026",closeDate:"6/23/2026",commissionBuyer:"3.0",complianceFee:"495",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"CTC Seller pre-signing 6/18, Buyer 6/23 2:30 PM"},
  {id:"p12",status:"pending",side:"Buyer Side",propertyAddress:"2414 Concord Street, Detroit, MI 48207",buyers:"Megan Schaefer",sellers:"Monarch517 LLC",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Erica Collica Swink",listingAgentCompany:"Max Brook Realtors Detroit",purchasePrice:"$410,000",emdAmount:"$4,000",emdHolder:"Reputation First",loanType:"FHA",lender:"Flagstar Home Loans",acceptanceDate:"5/27/2026",emdDueDate:"05/29/2026",financingDeadline:"6/26/2026",inspectionDeadline:"6/1/2026",closeDate:"6/26/2026",commissionBuyer:"3.0",complianceFee:"695",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Inspection 5/29 9am"},
  {id:"p13",status:"pending",side:"Seller Side",propertyAddress:"27564 W Chicago Street, Livonia, MI 48150",sellers:"Abhishek Anand and Katelyn Vance",buyers:"Miles Lenane",listingAgent:"Sam Sais",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Bradford Morgan",buyerAgentCompany:"Jim Saros Real Estate Services",purchasePrice:"$266,000",emdAmount:"$5,000",emdHolder:"Jim Saros Agency Inc.",loanType:"Conventional",lender:"The Mortgage Link",acceptanceDate:"5/28/2026",emdDueDate:"05/31/2026",financingDeadline:"7/7/2026",inspectionDeadline:"6/2/2026",closeDate:"7/10/2026",commissionListing:"3.0",complianceFee:"595",sellerTitleCompany:"Title WRX Agency",notes:"Inspection 5/29"},
  {id:"p14",status:"pending",side:"Buyer Side",propertyAddress:"1977 Princeton Rd, Berkley, MI 48072",buyers:"Iman Al-Nsour",sellers:"George Banot",buyerAgent:"Arash Goneh-Farahan",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Jennifer Gross",listingAgentCompany:"Key Realty One LLC",purchasePrice:"$162,000",emdAmount:"$2,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Next Door Lending",acceptanceDate:"5/28/2026",emdDueDate:"05/30/2026",financingDeadline:"6/27/2026",inspectionDeadline:"6/7/2026",closeDate:"6/26/2026",commissionBuyer:"1.0",complianceFee:"395",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"CTC 6/26"},
  {id:"p15",status:"pending",side:"Buyer Side",propertyAddress:"16579 Woodlane Drive, Fraser, MI 48026",buyers:"Slavica Bogoevska",sellers:"Sandra C DeSmith Living Trust",buyerAgent:"Arash Goneh-Farahan",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Daniel Schick",listingAgentCompany:"Realteam Real Estate",purchasePrice:"$120,000",emdAmount:"$2,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Lake Michigan Credit Union",acceptanceDate:"5/30/2026",emdDueDate:"06/01/2026",financingDeadline:"6/19/2026",inspectionDeadline:"6/4/2026",closeDate:"6/19/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Inspection Done"},
  {id:"p16",status:"pending",side:"Buyer Side",propertyAddress:"35 Michigan Avenue, Mt Clemens, MI 48043",buyers:"Sheldon Williams and Kathleen ONeill",sellers:"Ramon Brazier",buyerAgent:"Arash Goneh-Farahan",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Julian Llera",listingAgentCompany:"Realty Executives Homes Towne Shelby",purchasePrice:"$164,900",emdAmount:"$2,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Edge Home Finance LLC",acceptanceDate:"5/31/2026",emdDueDate:"06/02/2026",financingDeadline:"6/30/2026",inspectionDeadline:"6/5/2026",closeDate:"6/30/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"6/3 inspection. Appraisal ordered"},
  {id:"p17",status:"pending",side:"Seller Side",propertyAddress:"4933 Iroquois Boulevard, Independence Twp, MI 48348",sellers:"Matthew and Linda Wells",buyers:"Jason J. Cotta and Nicole L. Gressa",listingAgent:"Sam Sais",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Tanya A. Biernat",buyerAgentCompany:"Real Estate One",purchasePrice:"$430,000",emdAmount:"$5,000",emdHolder:"Real Estate One",loanType:"Conventional",lender:"John Adams Mortgage",acceptanceDate:"5/31/2026",emdDueDate:"06/02/2026",financingDeadline:"6/30/2026",inspectionDeadline:"6/5/2026",closeDate:"6/30/2026",commissionListing:"2.5",complianceFee:"595",sellerTitleCompany:"Capital One",notes:"CTC 6/23 10AM"},
  {id:"p18",status:"pending",side:"Buyer Side",propertyAddress:"16268 Kirkshire Avenue, Beverly Hills Village, MI 48025",buyers:"Liliana Gisel Garcia Echevarria",sellers:"Adam and Elizabeth Lachowicz",buyerAgent:"Arash Goneh-Farahan",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Ashley Mann",listingAgentCompany:"@properties Christies Intl Birmingham",purchasePrice:"$570,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Edge Home Finance LLC",acceptanceDate:"6/1/2026",emdDueDate:"06/03/2026",financingDeadline:"7/1/2026",inspectionDeadline:"6/11/2026",closeDate:"7/15/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"6/2 Inspection 5pm. CTC 7/15"},
  {id:"p19",status:"pending",side:"Seller Side",propertyAddress:"29100 Creek Bend Drive, Farmington Hills, MI 48331",sellers:"Keqin Xu and Yunhua Huang",buyers:"Mark Greer and Jamesia Johnson",listingAgent:"Saed Kakish",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Veneesha Slater",buyerAgentCompany:"Slater Signature Homes",purchasePrice:"$547,000",emdAmount:"$5,000",emdHolder:"Vital Title",loanType:"FHA",lender:"Guild Mortgage",acceptanceDate:"6/1/2026",emdDueDate:"06/04/2026",financingDeadline:"7/1/2026",inspectionDeadline:"6/6/2026",closeDate:"6/30/2026",complianceFee:"595",sellerTitleCompany:"Vital Title",notes:"Send Inspection and appraisal email"},
  {id:"p20",status:"pending",side:"Seller Side",propertyAddress:"24248 Hayes Avenue, Eastpointe, MI 48021",sellers:"Nathan Robinson",buyers:"Daniel Nowiski",listingAgent:"Saed Kakish",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Renee Smith",buyerAgentCompany:"Move MI Realty LLC",purchasePrice:"$185,000",emdAmount:"$2,000",emdHolder:"Title Partners",loanType:"FHA/MSHDA",lender:"Superior National Bank",acceptanceDate:"6/1/2026",emdDueDate:"06/06/2026",financingDeadline:"7/1/2026",inspectionDeadline:"6/11/2026",closeDate:"6/30/2026",complianceFee:"595",sellerTitleCompany:"Title Partners",notes:"6/11 Inspection 1pm"},
  {id:"p21",status:"pending",side:"Buyer Side",propertyAddress:"41 E Madge Avenue, Hazel Park, MI 48030",buyers:"Isabella Taylor",sellers:"Dana M. Elgie",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Christian J. Grothe",listingAgentCompany:"Max Broock REALTORS Birmingham",purchasePrice:"$159,000",emdAmount:"$2,500",emdHolder:"Reputation First",loanType:"FHA",lender:"BIF",acceptanceDate:"6/1/2026",emdDueDate:"06/03/2026",financingDeadline:"7/1/2026",inspectionDeadline:"6/6/2026",closeDate:"7/3/2026",commissionBuyer:"3.0",complianceFee:"695",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p22",status:"pending",side:"Seller Side",propertyAddress:"1615 Redbud Drive, Troy, MI 48098",sellers:"Nora Benjamin and Joseph Benjamin",buyers:"Sean Dawes and Christine Plichta",listingAgent:"Dany Ori",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Donnie Pauck",buyerAgentCompany:"Good Company Realty",purchasePrice:"$805,000",emdAmount:"$5,000",emdHolder:"Good Company Realty",loanType:"Conventional",lender:"First Federal Lakewood",acceptanceDate:"6/1/2026",emdDueDate:"06/03/2026",financingDeadline:"7/1/2026",inspectionDeadline:"6/8/2026",closeDate:"6/30/2026",commissionListing:"2000",complianceFee:"495",sellerTitleCompany:"Abstract Title",notes:"Send Inspection and appraisal email"},
  {id:"p23",status:"pending",side:"Buyer Side",propertyAddress:"25205 Inkster Road, Farmington Hills, MI 48336",buyers:"Nua Vuljaj",sellers:"Nicholas Flevaris",buyerAgent:"Valbona Vulaj",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Cheryl L Kachaturoff",listingAgentCompany:"Century 21 Curran and Oberski",purchasePrice:"$175,000",emdAmount:"$5,000",emdHolder:"Title One",loanType:"Cash",acceptanceDate:"6/1/2026",emdDueDate:"06/06/2026",financingDeadline:"N/A",inspectionDeadline:"6/8/2026",closeDate:"6/15/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Title One",notes:"Waiting for Mutual release"},
  {id:"p24",status:"pending",side:"Buyer Side",propertyAddress:"2496 Ketzler Dr, Flint Township, MI 48507",buyers:"Dewight Beckem",sellers:"Kavina Grayden",buyerAgent:"Monica Galloway",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Kavina Walker",listingAgentCompany:"Howard Homes 4 You LLC",purchasePrice:"$239,000",emdAmount:"$2,390",emdHolder:"Reputation First",loanType:"FHA",lender:"Epic Mortgage Group",acceptanceDate:"6/2/2026",emdDueDate:"06/05/2026",financingDeadline:"6/27/2026",inspectionDeadline:"6/9/2026",closeDate:"7/15/2026",commissionBuyer:"3.0",complianceFee:"549",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p25",status:"pending",side:"Seller Side",propertyAddress:"18364 Beechwood Street, Roseville MI 48066",sellers:"Julie Huyghe and Keith Huyghe",buyers:"April Brown",listingAgent:"Triston Dadou",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Akram Aqib",buyerAgentCompany:"Home Source Realty",purchasePrice:"$300,000",emdAmount:"$2,500",emdHolder:"Vanguard Title Company",loanType:"FHA",lender:"Luminate Home Loans",acceptanceDate:"6/2/2026",emdDueDate:"06/04/2026",financingDeadline:"6/9/2026",inspectionDeadline:"Waived",closeDate:"7/15/2026",complianceFee:"595",sellerTitleCompany:"Vanguard Title Company",notes:"No Inspection. Ordering appraisal ASAP"},
  {id:"p26",status:"pending",side:"Buyer Side",propertyAddress:"30068 Astor Street, Farmington Hills, MI 48334",buyers:"Douglas Williams and Vera Williams",sellers:"Kathleen James",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Michele K. Papatheodore",listingAgentCompany:"Keller Williams First",purchasePrice:"$305,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"One Stop Financial Group LLC",acceptanceDate:"6/7/2026",emdDueDate:"06/09/2026",financingDeadline:"7/7/2026",inspectionDeadline:"6/10/2026",closeDate:"7/7/2026",commissionBuyer:"3.0",complianceFee:"695",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p27",status:"pending",side:"Buyer Side",propertyAddress:"3983 Wing Drive, Hamburg Township, MI 48169",buyers:"Robby Jenkins and Christine Jenkins",sellers:"Scott Pestka and Amy Pestka",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Mary K. Carano",listingAgentCompany:"National Realty Centers Inc.",purchasePrice:"$575,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"One Stop Financial Group LLC",acceptanceDate:"6/5/2026",emdDueDate:"06/07/2026",financingDeadline:"7/3/2026",inspectionDeadline:"6/10/2026",closeDate:"7/3/2026",commissionBuyer:"3.0",complianceFee:"695",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Inspection 6/9 3PM"},
  {id:"p28",status:"pending",side:"Seller Side",propertyAddress:"42812 Ledgeview Drive, Novi MI 48377",sellers:"Brandon Helchowski and Jennifer Helchowski",buyers:"Yacoub Apoian",listingAgent:"Valbona Vulaj",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Jason Sabbagh",buyerAgentCompany:"American Dream Estates",purchasePrice:"$615,000",emdAmount:"$6,000",emdHolder:"Embassy Title",loanType:"Conventional",lender:"Union Home Mortgage",acceptanceDate:"6/7/2026",emdDueDate:"06/09/2026",financingDeadline:"6/12/2026",inspectionDeadline:"6/12/2026",closeDate:"7/6/2026",complianceFee:"595",sellerTitleCompany:"Embassy Title",notes:"Send Inspection and appraisal email"},
  {id:"p29",status:"pending",side:"Buyer Side",propertyAddress:"6514 Shagbark Drive, Troy MI 48098",buyers:"Tanay Paliwal and Nupur Assudani",sellers:"Shahnaj Qureshi and Mujadded Qureshi",buyerAgent:"Adriane Kizy",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Mujadded Qureshi",listingAgentCompany:"Amin Realty",purchasePrice:"$876,000",emdAmount:"$8,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"TBD",acceptanceDate:"6/7/2026",emdDueDate:"06/10/2026",financingDeadline:"07/22/2026",inspectionDeadline:"6/12/2026",closeDate:"7/10/2026",commissionBuyer:"3.0",complianceFee:"0",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Send Inspection and appraisal email"},
  {id:"p30",status:"pending",side:"Buyer Side",propertyAddress:"5338 Wildwood Dr, Howell MI 48843",buyers:"Richard and Kay Airton",sellers:"Dawn Bluga",buyerAgent:"Saed Kakish",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Anthony Maisano",listingAgentCompany:"Max Broock",purchasePrice:"$425,000",emdAmount:"$4,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"One Stop Financial Group LLC",acceptanceDate:"6/8/2026",emdDueDate:"6/10/2026",financingDeadline:"6/13/2026",inspectionDeadline:"6/13/2026",closeDate:"7/10/2026",commissionBuyer:"3.0",complianceFee:"395",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100",notes:"Moving past inspection. Ordering appraisal"},
  {id:"p31",status:"pending",side:"Seller Side",propertyAddress:"238 W Montcalm St, Pontiac, MI 48340",sellers:"Sandra Dougdoni and Anmar Dougdoni",buyers:"Amy Maust",listingAgent:"Revan Hermiz",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Mike Connors",buyerAgentCompany:"National Realty Centers Clarkston MI",purchasePrice:"$275,000",emdAmount:"$4,000",emdHolder:"Premier Title Agency",loanType:"Conventional",lender:"Northstar Bank",acceptanceDate:"6/9/2026",emdDueDate:"6/15/2026",financingDeadline:"7/9/2026",inspectionDeadline:"7/9/2026",closeDate:"7/16/2026",commissionListing:"3.0",complianceFee:"895",sellerTitleCompany:"Premier Title Agency",notes:"Send Inspection and appraisal email"},
  {id:"p32",status:"pending",side:"Buyer Side",propertyAddress:"70 W Hamlin Road, Rochester, MI 48307",buyers:"Sainath Pujari",sellers:"Victor Colmenares Mendoza and Gabriela Meza Sosa",buyerAgent:"Tamara Salmo",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Michael Perna",listingAgentCompany:"EXP Realty The Perna Team",purchasePrice:"$376,200",emdAmount:"$1,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Citizens Bank",acceptanceDate:"6/10/2026",emdDueDate:"6/12/2026",financingDeadline:"N/A",inspectionDeadline:"6/15/2026",closeDate:"7/7/2026",commissionBuyer:"2.5",complianceFee:"995",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100"},
  {id:"p33",status:"pending",side:"Seller Side",propertyAddress:"1293 Burns Road, Milford Twp 48381",sellers:"Nathan C. Shepherd and Tamara Shepherd",buyers:"Brett Hawthorne and Whitney Hawthorne",listingAgent:"Sam Sais",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Amber Hawthorne",buyerAgentCompany:"Coldwell Banker Town and Country",purchasePrice:"$656,500",emdAmount:"$19,000",emdHolder:"First Centennial Title",loanType:"Conventional",lender:"Honest Mortgage",acceptanceDate:"6/14/2026",emdDueDate:"6/14/2026",financingDeadline:"7/14/2026",inspectionDeadline:"6/19/2026",closeDate:"7/13/2026",commissionListing:"3.0",complianceFee:"595",sellerTitleCompany:"First Centennial Title",notes:"Inspection Sched 6/19"},
  {id:"p34",status:"pending",side:"Seller Side",propertyAddress:"43468 Hoptree Drive, Sterling Heights, MI 48314",sellers:"Shatha Qarana and Steven Qarana",buyers:"Arshed Pota and Mirna Mikha",listingAgent:"Noor Qarana",listingAgentCompany:"Golden Key Realty Group",buyerAgent:"Firas Goryoka",buyerAgentCompany:"Golden Key Group",purchasePrice:"$650,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Conventional",acceptanceDate:"6/6/2026",emdDueDate:"06/08/2026",financingDeadline:"7/6/2026",inspectionDeadline:"6/11/2026",closeDate:"7/10/2026",commissionListing:"1.5",complianceFee:"795",sellerTitleCompany:"Reputation First Title",sellerEscrowOfficer:"Ronda Flourre",sellerEscrowEmail:"rflourre@rftitle.com",sellerEscrowPhone:"734-432-0100"},
  {id:"p35",status:"pending",side:"Buyer Side",propertyAddress:"3129 Beacham Drive, Waterford, Oakland, MI 48329",buyers:"Kareem Davis",sellers:"Wing Cheung and Frances Cheung",buyerAgent:"Arash Goneh-Farahan",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Anthony Djon",purchasePrice:"$330,000",emdAmount:"$5,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"TBD",acceptanceDate:"6/15/2026",emdDueDate:"06/17/2026",financingDeadline:"7/15/2026",inspectionDeadline:"6/22/2026",closeDate:"7/17/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100"},
  {id:"p36",status:"pending",side:"Buyer Side",propertyAddress:"24576 Turnburry Court, Lyon Twp, MI 48178",buyers:"Mark Kalaj and Brianna Kalaj",sellers:"NEI Global Erin R Bode",buyerAgent:"Valbona Vulaj",buyerAgentCompany:"Golden Key Realty Group",listingAgent:"Rosemarie Tibbles",listingAgentCompany:"Keller Williams Advantage Northville",purchasePrice:"$725,000",emdAmount:"$10,000",emdHolder:"Reputation First",loanType:"Conventional",lender:"Michigan First Mortgage",acceptanceDate:"6/15/2026",emdDueDate:"06/17/2026",financingDeadline:"7/15/2026",inspectionDeadline:"6/19/2026",closeDate:"7/15/2026",commissionBuyer:"3.0",complianceFee:"595",buyerTitleCompany:"Reputation First Title",buyerEscrowOfficer:"Ronda Flourre",buyerEscrowEmail:"rflourre@rftitle.com",buyerEscrowPhone:"734-432-0100"},
];

const C = {ocean:"#4db6d0",seafoam:"#7ec8c0",coral:"#e8837a",sand:"#fdf6e3",text:"#2c4a52",muted:"#7a9ea8",border:"#c8dde3",card:"rgba(255,252,245,0.97)",white:"#ffffff"};
const pill = c => ({display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:c+"22",color:c,border:`1px solid ${c}55`});
const SH = ({label}) => <div style={{fontSize:10,fontWeight:700,color:C.ocean,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8,marginTop:16,paddingBottom:4,borderBottom:`2px solid ${C.seafoam}44`}}>{label}</div>;
const Rw = ({label,val}) => <div style={{display:"flex",gap:8,marginBottom:6}}><span style={{fontSize:12,color:C.muted,minWidth:160,flexShrink:0}}>{label}</span><span style={{fontSize:13,color:val?C.text:"#bbb"}}>{val||"—"}</span></div>;
const SearchBar = ({value,onChange}) => (
  <div style={{position:"relative",marginBottom:16,maxWidth:400}}>
    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>🔍</span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Search name, address, agent..."
      style={{width:"100%",padding:"9px 32px 9px 36px",border:`1.5px solid ${C.border}`,borderRadius:25,fontSize:13,color:C.text,background:C.white,outline:"none",boxSizing:"border-box"}}/>
    {value && <button onClick={()=>onChange("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,padding:0}}>✕</button>}
  </div>
);

const ClearToCloseModal = ({deal, onSave, onClose}) => {
  const [ctcDate,setCtcDate] = useState(deal.ctcDate||"");
  const [ctcTime,setCtcTime] = useState(deal.ctcTime||"");
  const [ctcLoc,setCtcLoc] = useState(deal.ctcLocation||"");
  const inp = {width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.text,background:C.white,outline:"none",boxSizing:"border-box"};
  return (
    <div style={{position:"fixed",inset:0,background:"#0007",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:20,width:"min(420px,95vw)",boxShadow:"0 12px 48px #00000030",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:`linear-gradient(135deg,${C.ocean},${C.seafoam})`,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:15,color:C.white}}>⭐ Clear to Closed — {deal.propertyAddress}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:50,width:28,height:28,color:C.white,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <div style={{padding:"20px 22px"}}>
          <p style={{fontSize:13,color:C.muted,marginBottom:16}}>All fields optional.</p>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>Closing Date</label><input type="date" value={ctcDate} onChange={e=>setCtcDate(e.target.value)} style={inp}/></div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>Closing Time</label><input type="time" value={ctcTime} onChange={e=>setCtcTime(e.target.value)} style={inp}/></div>
          <div style={{marginBottom:18}}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>Location</label><input type="text" value={ctcLoc} onChange={e=>setCtcLoc(e.target.value)} placeholder="e.g. Title company office..." style={inp}/></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>onSave({ctcDate,ctcTime,ctcLocation:ctcLoc})} style={{flex:1,background:`linear-gradient(135deg,${C.ocean},${C.seafoam})`,color:C.white,border:"none",borderRadius:12,padding:"10px",fontWeight:700,fontSize:13,cursor:"pointer"}}>Confirm ⭐</button>
            <button onClick={onClose} style={{background:C.white,color:C.muted,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 16px",fontWeight:500,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [deals, setDeals] = useState(PRELOADED);
  const [nav, setNav] = useState("read");
  const [sel, setSel] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseErr, setParseErr] = useState("");
  const [parsed, setParsed] = useState(null);
  const [drag, setDrag] = useState(false);
  const [hist, setHist] = useState([]);
  const [emailDeal, setEmailDeal] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [repSide, setRepSide] = useState("");
  const [done, setDone] = useState({});
  const [rmks, setRmks] = useState({});
  const [ctcDeal, setCtcDeal] = useState(null);
  const [sp,setSp]=useState(""); const [sc,setSc]=useState(""); const [sd,setSd]=useState(""); const [scl,setScl]=useState(""); const [st,setSt]=useState("");

  const pending = deals.filter(d=>d.status==="pending");
  const ctc = deals.filter(d=>d.status==="cleartoclosed");
  const closed = deals.filter(d=>d.status==="closed");
  const term = deals.filter(d=>d.status==="terminated");

  const dueDates = useMemo(()=>{
    const items=[];
    deals.forEach(d=>{
      [{label:"EMD Due",ds:d.emdDueDate,hi:true,rm:true},{label:"Inspection",ds:d.inspectionDeadline,hi:true,rm:true},{label:"Financing",ds:d.financingDeadline,hi:false,rm:false},{label:"Close Date",ds:d.closeDate,hi:true,rm:false}]
      .forEach(c=>{if(c.ds&&c.ds!=="N/A"&&c.ds!=="TBD"&&c.ds!=="Waived")items.push({...c,deal:d,days:daysUntil(c.ds)});});
    });
    return items.sort((a,b)=>(a.days??999)-(b.days??999));
  },[deals]);

  const isHi = item => { if(!item.hi) return false; const k=item.deal.id+"_"+item.label; if(done[k]) return false; return item.days!==null&&item.days<=2; };
  const togDone = item => { const k=item.deal.id+"_"+item.label; setDone(p=>({...p,[k]:!p[k]})); };
  const setRmk = (item,v) => { const k=item.deal.id+"_"+item.label; setRmks(p=>({...p,[k]:v})); };
  const saveHist = () => setHist(h=>[...h,{deals,nav,sel,parsed}]);
  const goBack = () => { if(!hist.length) return; const p=hist[hist.length-1]; setHist(h=>h.slice(0,-1)); setDeals(p.deals); setNav(p.nav); setSel(p.sel); setParsed(p.parsed); };
  const updStatus = (id,status,extra={}) => { saveHist(); setDeals(ds=>ds.map(d=>d.id===id?{...d,status,...extra}:d)); if(sel&&sel.id===id) setSel(s=>({...s,status,...extra})); };
  const delDeal = id => { saveHist(); setDeals(ds=>ds.filter(d=>d.id!==id)); if(sel&&sel.id===id) setSel(null); };

  const genEmail = d => {
    const la=[d.listingAgent,d.listingAgentCompany||"Golden Key Realty Group"].filter(Boolean).join(", ");
    const ba=[d.buyerAgent,d.buyerAgentCompany].filter(Boolean).join(", ");
    const bOpt=(l,v)=>v?`<p style="margin:4px 0"><b>${l}</b> ${v}</p>`:"";
    const bul=(l,v)=>v?`<li><b>${l}</b> ${v}</li>`:"";
    const hr=`<hr style="border:none;border-top:1px solid #ccc;margin:14px 0"/>`;
    const emd=[d.emdAmount?`${d.emdAmount}`:""  ,d.emdDueDate?`due date: ${d.emdDueDate}`:""  ,d.emdHolder?`held by: ${d.emdHolder}`:""].filter(Boolean).join(" – ");
    const fin=[d.financingDeadline?d.financingDeadline:"",d.loanType?`Loan Type: ${d.loanType}`:""].filter(Boolean).join(" – ");
    return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.65">
<p>Hi Everyone,</p>
<p>We officially have an accepted offer on the property at <b>${d.propertyAddress||"Property Address"}</b>, and the fully executed purchase package is attached to this email. My name is Katrina and I am the Transaction Coordinator for Golden Key Realty Group and will be assisting with the closing process. Please make sure to include me on all communications moving forward. Below is the contact information for all parties involved. I will continue to follow up and provide updates until we reach clear-to-close.</p>
${bOpt("Acceptance Date:",d.acceptanceDate)}${bOpt("Close Date:",d.closeDate)}${bOpt("Price:",d.purchasePrice)}
${emd?`<p style="margin:4px 0"><b>EMD:</b> ${emd}</p>`:""}
${bOpt("Inspection Deadline:",d.inspectionDeadline)}${fin?`<p style="margin:4px 0"><b>Financing Deadline:</b> ${fin}</p>`:""}
<p style="margin:10px 0 4px"><b>Commission Breakdown:</b></p>
<ul style="margin:0 0 4px;padding-left:24px">
<li>Listing Side: ${d.commissionListing||""}</li>
${d.commissionBuyer?`<li>Buyer Side: ${d.commissionBuyer}%</li>`:""}
</ul>
${bOpt("Compliance Fee:",d.complianceFee)}
<p style="margin:4px 0"><b>Brokerage:</b> Golden Key Realty Group, LLC</p>
${hr}
${bOpt("Seller:",d.sellers)}
${la?`<p style="margin:4px 0"><b>Listing Agent:</b> ${la}</p>`:""}
<ul style="margin:0 0 8px;padding-left:24px">${bul("Email:",d.listingAgentEmail)}${bul("Phone:",d.listingAgentPhone)}</ul>
${d.sellerTitleCompany?`<p style="margin:4px 0"><b>Sellers Title Company:</b> ${d.sellerTitleCompany}</p>`:""}
<ul style="margin:0 0 4px;padding-left:24px">${bul("Escrow Officer:",d.sellerEscrowOfficer)}${bul("Email:",d.sellerEscrowEmail)}${bul("Phone:",d.sellerEscrowPhone)}</ul>
${hr}
${bOpt("Buyer:",d.buyers)}
${ba?`<p style="margin:4px 0"><b>Buyers Agent:</b> ${ba}</p>`:""}
<ul style="margin:0 0 8px;padding-left:24px">${bul("Email:",d.buyerAgentEmail)}${bul("Phone:",d.buyerAgentPhone)}</ul>
${d.buyerTitleCompany?`<p style="margin:4px 0"><b>Buyers Title Company:</b> ${d.buyerTitleCompany}</p>`:""}
<ul style="margin:0 0 8px;padding-left:24px">${bul("Escrow Officer:",d.buyerEscrowOfficer)}${bul("Email:",d.buyerEscrowEmail)}${bul("Phone:",d.buyerEscrowPhone)}</ul>
<p style="margin:4px 0"><b>Buyers Lender:</b> ${d.lender||""}</p>
<ul style="margin:0 0 4px;padding-left:24px">${bul("Loan Officer:",d.loanOfficer)}${bul("Email:",d.loanOfficerEmail)}${bul("Phone:",d.loanOfficerPhone)}</ul>
${hr}
<p>If any of the above contact details need to be updated or corrected, please let me know. Thanks everyone! Looking forward to working with you all on a smooth closing.</p>
<p>Warm regards,<br/>Katrina</p></div>`;
  };

  const genPlain = d => {
    const la=[d.listingAgent,d.listingAgentCompany||"Golden Key Realty Group"].filter(Boolean).join(", ");
    const ba=[d.buyerAgent,d.buyerAgentCompany].filter(Boolean).join(", ");
    const div="─".repeat(50);
    const L=(label,v)=>v?`${label} ${v}\n`:"";
    const B=(label,v)=>v?`   - ${label} ${v}\n`:"";
    return `Hi Everyone,\n\nWe officially have an accepted offer on the property at ${d.propertyAddress||"[Property Address]"}, and the fully executed purchase package is attached to this email. My name is Katrina and I am the Transaction Coordinator for Golden Key Realty Group and will be assisting with the closing process. Please make sure to include me on all communications moving forward. Below is the contact information for all parties involved. I will continue to follow up and provide updates until we reach clear-to-close.\n\n${L("Acceptance Date:",d.acceptanceDate)}${L("Close Date:",d.closeDate)}${L("Price:",d.purchasePrice)}${d.emdAmount?`EMD: ${d.emdAmount}${d.emdDueDate?" – due date: "+d.emdDueDate:""}${d.emdHolder?" – held by: "+d.emdHolder:""}\n`:""}${L("Inspection Deadline:",d.inspectionDeadline)}${L("Financing Deadline:",d.financingDeadline)}\nCommission Breakdown:\n   - Listing Side: ${d.commissionListing||""}\n${d.commissionBuyer?"   - Buyer Side: "+d.commissionBuyer+"%\n":""}${L("Compliance Fee:",d.complianceFee)}Brokerage: Golden Key Realty Group, LLC\n\n${div}\n${L("Seller:",d.sellers)}${la?`Listing Agent: ${la}\n`:""}${B("Email:",d.listingAgentEmail)}${B("Phone:",d.listingAgentPhone)}${d.sellerTitleCompany?`\nSellers Title Company: ${d.sellerTitleCompany}\n`:""}${B("Escrow Officer:",d.sellerEscrowOfficer)}${B("Email:",d.sellerEscrowEmail)}${B("Phone:",d.sellerEscrowPhone)}\n${div}\n${L("Buyer:",d.buyers)}${ba?`Buyers Agent: ${ba}\n`:""}${B("Email:",d.buyerAgentEmail)}${B("Phone:",d.buyerAgentPhone)}${d.buyerTitleCompany?`\nBuyers Title Company: ${d.buyerTitleCompany}\n`:""}${B("Escrow Officer:",d.buyerEscrowOfficer)}${B("Email:",d.buyerEscrowEmail)}${B("Phone:",d.buyerEscrowPhone)}\nBuyers Lender: ${d.lender||""}\n${B("Loan Officer:",d.loanOfficer)}${B("Email:",d.loanOfficerEmail)}${B("Phone:",d.loanOfficerPhone)}\n${div}\n\nIf any of the above contact details need to be updated or corrected, please let me know. Thanks everyone! Looking forward to working with you all on a smooth closing.\n\nWarm regards,\nKatrina`;
  };

  const applyRF = (d,side) => side==="seller" ? {...d,sellerTitleCompany:RF.name,sellerEscrowOfficer:RF.escrow,sellerEscrowEmail:RF.email,sellerEscrowPhone:RF.phone} : {...d,buyerTitleCompany:RF.name,buyerEscrowOfficer:RF.escrow,buyerEscrowEmail:RF.email,buyerEscrowPhone:RF.phone};
  const openEmail = d => { setRepSide(""); setEmailDeal(d); setEmailBody(genEmail(d)); setCopied(false); };
  const getED = d => repSide ? applyRF(d,repSide) : d;
  const copyEmail = d => {
    const t=genPlain(getED(d));
    const run=()=>{const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0;";document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),2500);}catch(e){}document.body.removeChild(ta);};
    if(navigator.clipboard) navigator.clipboard.writeText(t).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(run); else run();
  };

  async function processFile(file) {
    if(!file) return;
    setParsing(true); setParseErr(""); setParsed(null); setNav("read");
    try {
      const base64 = await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
      const resp = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,system:`Extract purchase agreement fields and return ONLY JSON: {"propertyAddress":"","acceptanceDate":"","closeDate":"","purchasePrice":"","emdAmount":"","emdDueDate":"","emdDays":"","emdHolder":"","inspectionDeadline":"","inspectionDays":"","financingDeadline":"","financingDays":"","loanType":"","commissionListing":"","commissionBuyer":"","complianceFee":"","brokerage":"Golden Key Realty Group, LLC","sellers":"","listingAgent":"","listingAgentCompany":"","listingAgentEmail":"","listingAgentPhone":"","sellerTitleCompany":"","sellerEscrowOfficer":"","sellerEscrowEmail":"","sellerEscrowPhone":"","buyers":"","buyerAgent":"","buyerAgentCompany":"","buyerAgentEmail":"","buyerAgentPhone":"","buyerTitleCompany":"","buyerEscrowOfficer":"","buyerEscrowEmail":"","buyerEscrowPhone":"","lender":"","loanOfficer":"","loanOfficerEmail":"","loanOfficerPhone":""}. Dates as MM/DD/YYYY.`,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},{type:"text",text:"Extract and return JSON."}]}]})});
      const data=await resp.json();
      const text=data.content.find(b=>b.type==="text").text;
      const p=JSON.parse(text.replace(/```json|```/g,"").trim());
      p.id="new-"+Date.now(); p.status="pending"; p.side="";
      setParsed(p);
    } catch(e) { setParseErr("Could not parse. Please try again."); }
    finally { setParsing(false); }
  }

  const bBtn = (bg,color,bc) => ({background:bg,color,border:`1.5px solid ${bc}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"});

  const StatusBtns = ({d,stop}) => {
    const w = fn => stop ? e=>{e.stopPropagation();fn();} : fn;
    const b = (lbl,fn,bg,c,bc) => <button onClick={w(fn)} style={bBtn(bg,c,bc)}>{lbl}</button>;
    return (
      <div style={{display:"flex",gap:6,marginTop:10,paddingTop:10,borderTop:`1px dashed ${C.border}`,flexWrap:"wrap"}}>
        {d.status==="pending" && <>
          {b("✉ Email",()=>openEmail(d),C.ocean+"22",C.ocean,C.ocean+"55")}
          {b("⭐ Clear to Close",()=>setCtcDeal(d),C.seafoam+"22",C.seafoam,C.seafoam+"55")}
          {b("🪸 Terminate",()=>updStatus(d.id,"terminated"),C.coral+"22",C.coral,C.coral+"55")}
          {b("🗑 Delete",()=>delDeal(d.id),"#f1f5f9",C.muted,C.border)}
        </>}
        {d.status==="cleartoclosed" && <>
          {b("↩ Pending",()=>updStatus(d.id,"pending"),"#fef9c3","#854d0e","#fde047")}
          {b("Mark Closed",()=>updStatus(d.id,"closed"),C.seafoam+"22",C.seafoam,C.seafoam+"55")}
          {b("🪸 Terminate",()=>updStatus(d.id,"terminated"),C.coral+"22",C.coral,C.coral+"55")}
        </>}
        {d.status==="closed" && <>
          {b("↩ Reopen",()=>updStatus(d.id,"pending"),"#fef9c3","#854d0e","#fde047")}
          {b("🪸 Terminate",()=>updStatus(d.id,"terminated"),C.coral+"22",C.coral,C.coral+"55")}
        </>}
        {d.status==="terminated" && <>
          {b("↩ Reopen",()=>updStatus(d.id,"pending"),"#fef9c3","#854d0e","#fde047")}
          {b("Mark Closed",()=>updStatus(d.id,"closed"),C.seafoam+"22",C.seafoam,C.seafoam+"55")}
        </>}
      </div>
    );
  };

  const Card = ({d}) => (
    <div onClick={()=>setSel(d)} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"14px 18px",marginBottom:12,cursor:"pointer",boxShadow:"0 2px 10px #00000010",transition:"all 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 20px #00000018";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 10px #00000010";e.currentTarget.style.transform="translateY(0)";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{d.buyers||d.sellers||"Unnamed"}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:7}}>🏠 {d.propertyAddress} · {d.purchasePrice} · 📅 {d.closeDate||"—"}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {d.side && <span style={pill(d.side==="Seller Side"?C.coral:C.ocean)}>{d.side}</span>}
            {d.loanType && <span style={pill(C.muted)}>{d.loanType}</span>}
            {d.purchasePrice && <span style={pill(C.seafoam)}>{d.purchasePrice}</span>}
          </div>
          {d.status==="cleartoclosed"&&(d.ctcDate||d.ctcTime||d.ctcLocation)&&(
            <div style={{marginTop:8,background:C.seafoam+"22",border:`1px solid ${C.seafoam}`,borderRadius:8,padding:"6px 10px",fontSize:11,color:C.text}}>
              <b>⭐ CTC:</b>{d.ctcDate&&` 📅 ${d.ctcDate}`}{d.ctcTime&&` 🕐 ${d.ctcTime}`}{d.ctcLocation&&` 📍 ${d.ctcLocation}`}
            </div>
          )}
          {d.notes && <div style={{marginTop:6,fontSize:11,color:C.muted,fontStyle:"italic"}}>📝 {d.notes}</div>}
        </div>
        <div style={{textAlign:"right",fontSize:11,color:C.muted,flexShrink:0}}>
          <div>🤝 <b style={{color:C.text}}>{d.buyerAgent||d.listingAgent||"—"}</b></div>
          <div style={{marginTop:3}}>🏦 <b style={{color:C.text}}>{d.lender||"—"}</b></div>
        </div>
      </div>
      <StatusBtns d={d} stop={true}/>
    </div>
  );

  const DealList = ({title,list,emptyMsg,search,setSearch}) => {
    const filtered = list.filter(d=>matchSearch(d,search));
    return (
      <div style={{flex:1,padding:"24px 28px",overflow:"auto"}}>
        <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>{title} <span style={{fontSize:13,color:C.muted,fontWeight:400}}>({list.length})</span></div>
        <div style={{marginBottom:16}}><SearchBar value={search} onChange={setSearch}/></div>
        {list.length===0 ? <div style={{color:C.muted,fontSize:14,textAlign:"center",padding:"40px 0"}}>🌊 {emptyMsg}</div>
          : filtered.length===0 ? <div style={{color:C.muted,fontSize:14}}>No results for "{search}"</div>
          : filtered.map(d=><Card key={d.id} d={d}/>)}
      </div>
    );
  };

  const DueDatesPanel = () => {
    const filtered = dueDates.filter(item=>!sd||[item.deal.buyers,item.deal.sellers,item.deal.propertyAddress,item.deal.buyerAgent,item.deal.listingAgent,item.label].some(f=>f&&f.toLowerCase().includes(sd.toLowerCase())));
    return (
      <div style={{flex:1,padding:"24px 28px",overflow:"auto"}}>
        <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>🦀 Due Dates</div>
        <div style={{marginBottom:16}}><SearchBar value={sd} onChange={setSd}/></div>
        {dueDates.length===0 ? <div style={{color:C.muted,fontSize:14,textAlign:"center",padding:"40px 0"}}>🌊 No deadlines yet.</div> : (
          <div style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px #00000010"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:`linear-gradient(135deg,${C.ocean}22,${C.seafoam}22)`}}>
                    {["Date","Deadline","Party","Agent","Days Left","Remarks","Mark Complete"].map((h,i)=>(
                      <th key={i} style={{textAlign:"left",padding:"10px 14px",fontSize:10,fontWeight:700,color:C.ocean,textTransform:"uppercase",letterSpacing:0.7,borderBottom:`1.5px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item,i)=>{
                    const k=item.deal.id+"_"+item.label;
                    const hi=isHi(item); const comp=done[k]; const rmk=rmks[k]||"";
                    return (
                      <tr key={i} style={{borderTop:`1px solid ${C.border}`,background:hi&&!comp?"#fff1f0":"transparent"}}
                        onMouseEnter={e=>e.currentTarget.style.background=hi&&!comp?"#ffe4e1":"#f8fdff"}
                        onMouseLeave={e=>e.currentTarget.style.background=hi&&!comp?"#fff1f0":"transparent"}>
                        <td style={{padding:"10px 14px",fontWeight:600,color:comp?"#aaa":C.text,textDecoration:comp?"line-through":"none",whiteSpace:"nowrap"}}>{item.ds}</td>
                        <td style={{padding:"10px 14px",color:comp?"#aaa":C.text,whiteSpace:"nowrap"}}>{hi&&!comp&&<span style={{marginRight:5}}>🔴</span>}{item.label}</td>
                        <td style={{padding:"10px 14px",color:C.muted,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.deal.buyers||item.deal.sellers||"—"}</td>
                        <td style={{padding:"10px 14px",color:C.muted,whiteSpace:"nowrap"}}>{item.deal.buyerAgent||item.deal.listingAgent||"—"}</td>
                        <td style={{padding:"10px 14px"}}><span style={pill(comp?"#94a3b8":urgColor(item.days))}>{item.days===null?"—":item.days===0?"Today":item.days<0?`${Math.abs(item.days)}d ago`:`${item.days}d`}</span></td>
                        <td style={{padding:"8px 14px",minWidth:150}}>
                          {item.rm ? <input type="date" value={rmk} onChange={e=>setRmk(item,e.target.value)} style={{width:"100%",padding:"5px 7px",border:`1.5px solid ${C.border}`,borderRadius:7,fontSize:11,color:C.text,background:rmk?C.seafoam+"22":C.white,outline:"none",boxSizing:"border-box"}}/> : <span style={{color:"#ccc"}}>—</span>}
                        </td>
                        <td style={{padding:"10px 14px"}}>
                          {item.rm ? <button onClick={()=>togDone(item)} style={{...bBtn(comp?C.seafoam+"33":C.white,comp?C.seafoam:C.muted,comp?C.seafoam:C.border),fontSize:10}}>{comp?"✓ Done":"Mark Complete"}</button> : <span style={{color:"#ccc"}}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ReadPanel = () => (
    <div style={{flex:1,padding:"24px 28px",overflow:"auto"}}>
      <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:6}}>🐚 Read Contract</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Upload a purchase agreement to auto-extract transaction details.</div>
      {!parsing&&!parsed&&(
        <>
          <label onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f){saveHist();processFile(f);}}}
            style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`2px dashed ${drag?C.ocean:C.border}`,borderRadius:18,padding:"44px 28px",cursor:"pointer",background:drag?C.ocean+"11":C.white,maxWidth:460,transition:"all 0.2s",boxShadow:"0 2px 10px #00000008"}}>
            <div style={{fontSize:44,marginBottom:10}}>🐚</div>
            <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:3}}>Upload purchase agreement</div>
            <div style={{fontSize:12,color:C.muted}}>PDF — click or drag and drop</div>
            <input type="file" accept=".pdf" style={{display:"none"}} onChange={e=>{saveHist();processFile(e.target.files[0]);}}/>
          </label>
          {parseErr&&<div style={{marginTop:14,color:C.coral,fontSize:13,background:C.coral+"11",border:`1px solid ${C.coral}44`,borderRadius:10,padding:"10px 14px",maxWidth:460}}>{parseErr}</div>}
        </>
      )}
      {parsing&&<div style={{textAlign:"center",padding:"44px 0"}}><div style={{fontSize:44,marginBottom:10}}>🌊</div><div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:5}}>Reading contract…</div><div style={{fontSize:13,color:C.muted}}>Claude is extracting transaction details</div><div style={{marginTop:16,height:5,background:C.border,borderRadius:5,overflow:"hidden",maxWidth:280,margin:"16px auto 0"}}><div style={{height:"100%",width:"65%",background:`linear-gradient(90deg,${C.ocean},${C.seafoam})`,borderRadius:5}}/></div></div>}
      {parsed&&!parsing&&(
        <div style={{maxWidth:600}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}><span style={{fontSize:20}}>🌸</span><span style={{fontWeight:700,fontSize:14,color:C.seafoam}}>Contract parsed!</span></div>
          <div style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:14,boxShadow:"0 2px 10px #00000010"}}>
            <SH label="Key Dates"/><Rw label="Property Address" val={parsed.propertyAddress}/><Rw label="Acceptance Date" val={parsed.acceptanceDate}/><Rw label="Close Date" val={parsed.closeDate}/><Rw label="Purchase Price" val={parsed.purchasePrice}/><Rw label="EMD Amount" val={parsed.emdAmount}/><Rw label="EMD Due Date" val={parsed.emdDueDate}/><Rw label="EMD Holder" val={parsed.emdHolder}/><Rw label="Inspection Deadline" val={parsed.inspectionDeadline}/><Rw label="Financing Deadline" val={parsed.financingDeadline}/><Rw label="Loan Type" val={parsed.loanType}/>
            <SH label="Commission"/><Rw label="Listing Side" val={parsed.commissionListing}/><Rw label="Buyer Side" val={parsed.commissionBuyer}/><Rw label="Compliance Fee" val={parsed.complianceFee}/>
            <SH label="Seller"/><Rw label="Seller(s)" val={parsed.sellers}/><Rw label="Listing Agent" val={parsed.listingAgent}/><Rw label="Company" val={parsed.listingAgentCompany}/><Rw label="Email" val={parsed.listingAgentEmail}/><Rw label="Phone" val={parsed.listingAgentPhone}/><Rw label="Sellers Title" val={parsed.sellerTitleCompany}/><Rw label="Escrow Officer" val={parsed.sellerEscrowOfficer}/>
            <SH label="Buyer"/><Rw label="Buyer(s)" val={parsed.buyers}/><Rw label="Buyers Agent" val={parsed.buyerAgent}/><Rw label="Company" val={parsed.buyerAgentCompany}/><Rw label="Email" val={parsed.buyerAgentEmail}/><Rw label="Phone" val={parsed.buyerAgentPhone}/><Rw label="Buyers Title" val={parsed.buyerTitleCompany}/><Rw label="Escrow Officer" val={parsed.buyerEscrowOfficer}/>
            <SH label="Lender"/><Rw label="Buyers Lender" val={parsed.lender}/><Rw label="Loan Officer" val={parsed.loanOfficer}/><Rw label="Email" val={parsed.loanOfficerEmail}/><Rw label="Phone" val={parsed.loanOfficerPhone}/>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:12,fontWeight:600,color:C.text}}>Transaction Side:</span>
            {["Seller Side","Buyer Side"].map(s=><button key={s} onClick={()=>setParsed(p=>({...p,side:s}))} style={{padding:"7px 18px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",border:`2px solid ${parsed.side===s?C.ocean:C.border}`,background:parsed.side===s?C.ocean:C.white,color:parsed.side===s?C.white:C.muted,transition:"all 0.15s"}}>{s==="Seller Side"?"🏠 Seller":"🏖️ Buyer"}</button>)}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>{saveHist();setDeals(ds=>[parsed,...ds]);setSel(parsed);setParsed(null);setNav("pending");}} style={{background:`linear-gradient(135deg,${C.ocean},${C.seafoam})`,color:C.white,border:"none",borderRadius:20,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🌊 Add to Pending</button>
            <button onClick={()=>openEmail(parsed)} style={{background:`linear-gradient(135deg,${C.coral},#f0a070)`,color:C.white,border:"none",borderRadius:20,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>✉️ Send Email</button>
            <button onClick={()=>setParsed(null)} style={{background:C.white,color:C.muted,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"10px 20px",fontWeight:500,fontSize:13,cursor:"pointer"}}>↩ Re-upload</button>
          </div>
        </div>
      )}
    </div>
  );

  const DetailPane = ({d}) => (
    <div style={{width:350,borderLeft:`1.5px solid ${C.border}`,background:C.card,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
      <div style={{background:`linear-gradient(135deg,${C.ocean}22,${C.seafoam}22)`,padding:"14px 18px",borderBottom:`1.5px solid ${C.border}`}}>
        <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginBottom:8,padding:0}}>← Close</button>
        <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{d.buyers||d.sellers||"Transaction"}</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:6}}>{d.purchasePrice} · 📅 {d.closeDate||"—"}</div>
        {d.side&&<span style={{...pill(d.side==="Seller Side"?C.coral:C.ocean),display:"inline-block",marginBottom:6}}>{d.side}</span>}
        {d.status==="pending"&&<button onClick={()=>openEmail(d)} style={{background:`linear-gradient(135deg,${C.coral},#f0a070)`,color:C.white,border:"none",borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",width:"100%",marginTop:4}}>✉️ Send Email</button>}
      </div>
      <div style={{flex:1,overflow:"auto",padding:"14px 18px"}}>
        {d.status==="cleartoclosed"&&(d.ctcDate||d.ctcTime||d.ctcLocation)&&<div style={{background:C.seafoam+"22",border:`1px solid ${C.seafoam}`,borderRadius:8,padding:"8px 12px",marginBottom:4,fontSize:12,color:C.text}}><b>⭐ CTC Details</b>{d.ctcDate&&<div>📅 {d.ctcDate}</div>}{d.ctcTime&&<div>🕐 {d.ctcTime}</div>}{d.ctcLocation&&<div>📍 {d.ctcLocation}</div>}</div>}
        <SH label="Key Dates"/><Rw label="Acceptance Date" val={d.acceptanceDate}/><Rw label="Close Date" val={d.closeDate}/><Rw label="Purchase Price" val={d.purchasePrice}/><Rw label="EMD" val={d.emdAmount}/><Rw label="EMD Due" val={d.emdDueDate}/><Rw label="EMD Holder" val={d.emdHolder}/><Rw label="Inspection" val={d.inspectionDeadline}/><Rw label="Financing" val={d.financingDeadline}/><Rw label="Loan Type" val={d.loanType}/>
        <SH label="Commission"/><Rw label="Listing Side" val={d.commissionListing}/><Rw label="Buyer Side" val={d.commissionBuyer}/><Rw label="Compliance Fee" val={d.complianceFee}/>
        <SH label="Seller"/><Rw label="Seller(s)" val={d.sellers}/><Rw label="Listing Agent" val={d.listingAgent}/><Rw label="Company" val={d.listingAgentCompany}/><Rw label="Email" val={d.listingAgentEmail}/><Rw label="Phone" val={d.listingAgentPhone}/><Rw label="Sellers Title" val={d.sellerTitleCompany}/><Rw label="Escrow Officer" val={d.sellerEscrowOfficer}/><Rw label="Email" val={d.sellerEscrowEmail}/><Rw label="Phone" val={d.sellerEscrowPhone}/>
        <SH label="Buyer"/><Rw label="Buyer(s)" val={d.buyers}/><Rw label="Buyers Agent" val={d.buyerAgent}/><Rw label="Company" val={d.buyerAgentCompany}/><Rw label="Email" val={d.buyerAgentEmail}/><Rw label="Phone" val={d.buyerAgentPhone}/><Rw label="Buyers Title" val={d.buyerTitleCompany}/><Rw label="Escrow Officer" val={d.buyerEscrowOfficer}/><Rw label="Email" val={d.buyerEscrowEmail}/><Rw label="Phone" val={d.buyerEscrowPhone}/>
        <SH label="Lender"/><Rw label="Buyers Lender" val={d.lender}/><Rw label="Loan Officer" val={d.loanOfficer}/><Rw label="Email" val={d.loanOfficerEmail}/><Rw label="Phone" val={d.loanOfficerPhone}/>
        {d.notes&&<div style={{marginTop:10,background:C.ocean+"11",border:`1px solid ${C.ocean}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.text}}>📝 {d.notes}</div>}
      </div>
      <div style={{padding:"10px 18px",borderTop:`1.5px solid ${C.border}`}}><StatusBtns d={d} stop={false}/></div>
    </div>
  );

  const EmailModal = ({deal}) => {
    const ad = getED(deal);
    return (
      <div style={{position:"fixed",inset:0,background:"#0008",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setEmailDeal(null)}>
        <div style={{background:C.card,borderRadius:18,width:"min(740px,95vw)",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 16px 64px #00000030"}} onClick={e=>e.stopPropagation()}>
          <div style={{background:`linear-gradient(135deg,${C.ocean},${C.seafoam})`,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:15,color:C.white}}>✉️ TC Introduction Email</div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:1}}>{deal.propertyAddress||"Property"}</div></div>
            <button onClick={()=>setEmailDeal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:50,width:28,height:28,color:C.white,cursor:"pointer",fontSize:14}}>✕</button>
          </div>
          <div style={{padding:"10px 22px",borderBottom:`1px solid ${C.border}`,background:C.sand}}>
            <div style={{fontSize:11,fontWeight:600,color:C.text,marginBottom:6}}>🏡 Reputation First Title — assign to side:</div>
            <div style={{display:"flex",gap:8}}>
              {["","seller","buyer"].map(s=><button key={s} onClick={()=>setRepSide(s)} style={{padding:"5px 14px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",border:`1.5px solid ${repSide===s?C.ocean:C.border}`,background:repSide===s?C.ocean:C.white,color:repSide===s?C.white:C.muted}}>{s===""?"None":s==="seller"?"Seller Side":"Buyer Side"}</button>)}
            </div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"18px 24px",background:C.white}}>
            <div dangerouslySetInnerHTML={{__html:genEmail(ad)}}/>
          </div>
          <div style={{padding:"12px 22px",borderTop:`1.5px solid ${C.border}`,display:"flex",gap:8,justifyContent:"flex-end",background:C.sand}}>
            <button onClick={()=>setEmailDeal(null)} style={{background:C.white,color:C.muted,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"9px 18px",fontWeight:500,fontSize:12,cursor:"pointer"}}>Cancel</button>
            <button onClick={()=>copyEmail(deal)} style={{background:copied?`linear-gradient(135deg,${C.seafoam},#5ab090)`:`linear-gradient(135deg,${C.ocean},${C.seafoam})`,color:C.white,border:"none",borderRadius:20,padding:"9px 22px",fontWeight:700,fontSize:12,cursor:"pointer"}}>{copied?"✓ Copied!":"📋 Copy Email"}</button>
          </div>
        </div>
      </div>
    );
  };

  const mainPanel = () => {
    if(nav==="read") return <ReadPanel/>;
    if(nav==="pending") return <DealList title="🌊 Pending Deal" list={pending} emptyMsg="No pending deals." search={sp} setSearch={setSp}/>;
    if(nav==="cleartoclosed") return <DealList title="⭐ Clear to Closed" list={ctc} emptyMsg="No deals marked Clear to Close yet." search={sc} setSearch={setSc}/>;
    if(nav==="due") return <DueDatesPanel/>;
    if(nav==="closed") return <DealList title="🌸 Closed Contact" list={closed} emptyMsg="No closed deals yet." search={scl} setSearch={setScl}/>;
    if(nav==="terminated") return <DealList title="🪸 Terminated" list={term} emptyMsg="No terminated contracts." search={st} setSearch={setSt}/>;
    return <ReadPanel/>;
  };

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',system-ui,sans-serif",fontSize:13,background:"linear-gradient(180deg,#0a2a5e 0%,#1565C0 16%,#0288D1 25%,#0097A7 33%,#00796B 41%,#558B2F 50%,#F9A825 57%,#F57F17 63%,#E65100 69%,#BF360C 75%,#8B1A00 83%,#4a1200 100%)",position:"relative",overflow:"hidden"}}>

      {/* Beach decorations */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:14,right:"12%",width:80,height:80,borderRadius:"50%",background:"radial-gradient(circle,#fff 15%,#FFF59D 40%,#FFD600 65%,#FF6F00 85%,transparent 100%)",boxShadow:"0 0 80px 40px #FFD60099"}}/>
        <div style={{position:"absolute",top:18,left:"14%",background:"rgba(255,255,255,0.97)",borderRadius:30,width:100,height:34,boxShadow:"20px 0 0 12px rgba(255,255,255,0.97),-20px 0 0 12px rgba(255,255,255,0.97),0 -12px 0 10px rgba(255,255,255,0.97)"}}/>
        <div style={{position:"absolute",top:30,left:"32%",background:"rgba(255,255,255,0.93)",borderRadius:30,width:75,height:26,boxShadow:"15px 0 0 9px rgba(255,255,255,0.93),-15px 0 0 9px rgba(255,255,255,0.93),0 -9px 0 7px rgba(255,255,255,0.93)"}}/>
        <div style={{position:"absolute",top:10,left:"50%",background:"rgba(255,255,255,0.95)",borderRadius:30,width:115,height:38,boxShadow:"24px 0 0 14px rgba(255,255,255,0.95),-24px 0 0 14px rgba(255,255,255,0.95),0 -14px 0 12px rgba(255,255,255,0.95)"}}/>
        <div style={{position:"fixed",bottom:"22%",left:0,right:0,height:80,pointerEvents:"none"}}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{width:"100%",height:"100%"}}>
            <path d="M0,40 C180,10 360,70 540,40 C720,10 900,70 1080,40 C1260,10 1380,60 1440,40 L1440,80 L0,80 Z" fill="#01579B" opacity="1"/>
            <path d="M0,55 C200,25 400,75 600,50 C800,25 1000,75 1200,50 C1320,35 1400,60 1440,50 L1440,80 L0,80 Z" fill="#003c6e" opacity="0.9"/>
          </svg>
        </div>
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:"22%",background:"linear-gradient(180deg,#BF360C 0%,#8B1A00 40%,#4a1200 100%)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:24,background:"linear-gradient(180deg,#0288D1cc 0%,transparent 100%)",borderRadius:"60% 60% 0 0 / 16px 16px 0 0"}}/>
          {["8%","16%","25%","36%","48%","62%","72%","82%","91%"].map((l,i)=>(<span key={i} style={{position:"absolute",top:i%2===0?8:16,left:l,fontSize:16}}>{"🌺🐚🦀⭐🌸🐚🌺⭐🌸"[i]}</span>))}
        </div>
        <div style={{position:"fixed",bottom:"20%",left:-10,fontSize:88,lineHeight:1,filter:"drop-shadow(2px 4px 6px #00000033)"}}>🌴</div>
        <div style={{position:"fixed",bottom:"26%",left:55,fontSize:62,lineHeight:1,opacity:0.85}}>🌴</div>
        <div style={{position:"fixed",bottom:"18%",right:-8,fontSize:70,lineHeight:1,opacity:0.8}}>🌴</div>
        <div style={{position:"fixed",bottom:"30%",right:"18%",fontSize:26,opacity:0.75}}>⛵</div>
      </div>

      {/* Sidebar */}
      <div style={{width:210,background:"rgba(255,248,225,0.93)",backdropFilter:"blur(16px)",borderRight:`1.5px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,position:"relative",zIndex:10}}>
        <div style={{padding:"18px 14px 12px",borderBottom:`1.5px solid ${C.border}`,background:`linear-gradient(135deg,${C.ocean}22,${C.seafoam}22)`}}>
          <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:2}}>🌴 TC Tracker</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Golden Key Realty Group</div>
          {hist.length>0&&<button onClick={goBack} style={{display:"flex",alignItems:"center",gap:5,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,color:C.muted,cursor:"pointer",width:"100%"}}>← Back</button>}
        </div>
        <nav style={{padding:"8px 0",flex:1,overflow:"auto"}}>
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>{setNav(n.key);setSel(null);}}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 14px",paddingLeft:n.indent?26:14,cursor:"pointer",background:nav===n.key?C.ocean+"22":"transparent",color:nav===n.key?C.ocean:C.text,fontWeight:nav===n.key?700:400,fontSize:n.indent?12:13,border:"none",width:"100%",textAlign:"left",borderLeft:`3px solid ${nav===n.key?C.ocean:"transparent"}`,transition:"all 0.15s"}}>
              <span style={{fontSize:15}}>{n.icon}</span><span>{n.label}</span>
              {n.key==="pending"&&pending.length>0&&<span style={{marginLeft:"auto",background:C.ocean,color:C.white,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{pending.length}</span>}
              {n.key==="cleartoclosed"&&ctc.length>0&&<span style={{marginLeft:"auto",background:C.seafoam,color:C.white,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{ctc.length}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"10px 14px",borderTop:`1.5px solid ${C.border}`,background:`linear-gradient(135deg,${C.ocean}11,${C.seafoam}11)`,textAlign:"center"}}>
          <div style={{fontSize:10,color:C.muted}}>🌊 Smooth closings ahead</div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative",zIndex:10}}>
        <div style={{flex:1,overflow:"auto",background:"rgba(255,252,240,0.90)",backdropFilter:"blur(10px)"}}>{mainPanel()}</div>
        {sel&&<DetailPane d={sel}/>}
      </div>

      {emailDeal&&<EmailModal deal={emailDeal}/>}
      {ctcDeal&&<ClearToCloseModal deal={ctcDeal} onSave={info=>{updStatus(ctcDeal.id,"cleartoclosed",info);setCtcDeal(null);setNav("cleartoclosed");}} onClose={()=>setCtcDeal(null)}/>}
    </div>
  );
}
