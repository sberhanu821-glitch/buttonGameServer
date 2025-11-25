let express=require("express")
let bodyparser=require("body-parser")
let cors=require("cors")
let app=express()
app.use(bodyparser.json())
app.use(cors())
let users=new Map()
let user
app.post("/",function(req,res){
	let usertry=req.body.USERNAME
	if (users.has(usertry)) res.json({result: false})
	if (!users.has(usertry)) res.json({result: true})
})
app.post("/session",function(req,res){
	user=req.body.USERNAME
	users.set(user,req.body.SCORE)
	console.log(user+" is playing game on "+new Date()+"!!")
})
app.post("/score",function(req,res){
	users.set(req.body.USER,req.body.SCORE)
	console.log(req.body.USER+" has set a new high score of "+req.body.SCORE)
})
app.post("/leaderBoard",function(req,res){
	let scoreArray=[]
	for (const value of users.values()){
		scoreArray.push(value)
	}scoreArray.sort((a,b) => b-a)
	let userArray=[]
	for (const score of scoreArray){
		for (const key of users.keys()){
			if (users.get(key)==score && !userArray.includes(key)) userArray.push(key)
		}
	}let Rank
	let LeaderBoard=`<caption><b><u>Leader Board</u></b></caption>
					<thead>
						<tr>
							<th>Rank</th>
							<th>Players</th>
							<th>Score</th>
						</tr>
					</thead>
					`
	for (let i=0;i<userArray.length;i++){
		let rank=i+1
		let name=userArray[i]
		if (name==req.body.USER){
			name="<a style='color: blue'>You</a>"
			Rank=rank
		}LeaderBoard+=`<tr>
						<td>`+rank+`</td>
						<td>`+name+`</td>
						<td>`+users.get(userArray[i])+`</td>
   					   </tr>
   					   `
	}res.json({RANK: Rank, LEADERBOARD: LeaderBoard})
})
app.listen(7777,function(){
	console.log("Button Game Server is set up and ready for requests from http://localhost:7777")
})
