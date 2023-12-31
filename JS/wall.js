class wall extends physical{
    constructor(layer,x,y,width,height,type,index,zone){
        super(layer,x,y,width,height)
        this.type=type
        this.index=index
        this.zone=zone
        this.fade=1
        this.trigger={fade:true}
        this.collide={box:[entities.players]}
        this.base={width:this.width,height:this.height}
        this.deprecate=false
        this.interval=types.wall[this.type].interval
        this.set()
    }
    set(){
        switch(this.type){
            case 2:
                this.width=this.base.width-4
            break
            case 3:
                this.width=this.base.width-4
            break
            case 4:
                this.height=this.base.height-4
            break
            case 5:
                this.height=this.base.height-4
            break
            case 7:
                this.base.width=0
                this.base.height=0
                this.width=30
                this.height=30
                this.active=false
            break
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y)
        this.layer.noStroke()
        switch(this.type){
            case 1:
                this.layer.fill(120,this.fade)
                this.layer.rect(0,0,this.width+1,this.height+1)
            break
            case 2:
                this.layer.fill(200,this.fade)
                for(let a=0,la=this.base.width/20*3;a<la;a++){
                    this.layer.triangle(-this.base.width/2+a*20/3,this.height/2,-this.base.width/2+a*20/3+20/3,this.height/2,-this.base.width/2+a*20/3+10/3,-this.height*3/2)
                }
            break
            case 3:
                this.layer.fill(200,this.fade)
                for(let a=0,la=this.base.width/20*3;a<la;a++){
                    this.layer.triangle(-this.base.width/2+a*20/3,-this.height/2,-this.base.width/2+a*20/3+20/3,-this.height/2,-this.base.width/2+a*20/3+10/3,this.height*3/2)
                }
            break
            case 4:
                this.layer.fill(200,this.fade)
                for(let a=0,la=this.base.height/20*3;a<la;a++){
                    this.layer.triangle(this.width/2,-this.base.height/2+a*20/3,this.width/2,-this.base.height/2+a*20/3+20/3,-this.width*3/2,-this.base.height/2+a*20/3+10/3)
                }
            break
            case 5:
                this.layer.fill(200,this.fade)
                for(let a=0,la=this.base.height/20*3;a<la;a++){
                    this.layer.triangle(-this.width/2,-this.base.height/2+a*20/3,-this.width/2,-this.base.height/2+a*20/3+20/3,this.width*3/2,-this.base.height/2+a*20/3+10/3)
                }
            break
            case 6:
                this.layer.fill(90,this.fade)
                this.layer.rect(0,0,this.width+1,this.height+1)
            break
            case 7:
                this.layer.fill(123,189,156,this.fade)
                for(let a=0,la=15;a<la;a++){
                    this.layer.triangle(-2.25,12,2.25,12,0,21)
                    this.layer.rotate(360/la)
                }
                let colors=[[206,111,147],[234,147,180],[253,173,205],[236,141,177],[251,158,193],[255,177,210],[255,203,235]]
                let offset=[15,10,25,-15,10,15,10,25,-15]
                for(let a=0,la=7;a<la;a++){
                    this.layer.fill(colors[a][0],colors[a][1],colors[a][2],this.fade)
                    for(let b=0,lb=9;b<lb;b++){
                        this.layer.ellipse(0,9-a,6-a*2/3,18-a*2)
                        this.layer.rotate(360/la)
                    }
                    this.layer.rotate(offset[a])
                }
            break
        }
        this.layer.pop()
        if(dev.hitbox){
            super.display()
        }
    }
    expel(){
        for(let a=0,la=this.collide.box.length;a<la;a++){
            for(let b=0,lb=this.collide.box[a].length;b<lb;b++){
                if(inBoxBox(this,this.collide.box[a][b])){
                    this.collide.box[a][b].position.y=this.position.y-this.height/2-this.collide.box[a][b].height/2
                }
            }
        }
    }
    update(){
        this.fade=smoothAnim(this.fade,this.trigger.fade,0,1,5)
        if(this.fade<=0&&!this.trigger.fade){
            this.remove=true
        }
        for(let a=0,la=this.collide.box.length;a<la;a++){
            for(let b=0,lb=this.collide.box[a].length;b<lb;b++){
                let c=this.collide.box[a][b]
                if(inBoxBox({position:this.position,width:this.width+2,height:this.height+2},c)&&!c.orb.active){
                    let d=collideBoxBox(this,c)
                    c.contact[d]=true
                    if(d==1){
                        c.stamina=c.base.stamina
                    }
                }
                if(inBoxBox(this,c)){
                    let d=collideBoxBox(this,c)
                    c.crush[d]=true
                    switch(this.type){
                        case 2:
                            if(c.velocity.y>=0){
                                c.goal.dead=true
                            }
                        break
                        case 3:
                            if(c.velocity.y<=0){
                                c.goal.dead=true
                            }
                        break
                        case 4:
                            if(c.velocity.x>=0){
                                c.goal.dead=true
                            }
                        break
                        case 5:
                            if(c.velocity.x<=0){
                                c.goal.dead=true
                            }
                        break
                        case 7:
                            if(!this.active){
                                this.active=true
                                this.trigger.fade=false
                                game.flowers++
                                elements.flower.timer=180
                                for(let a=0,la=8;a<la;a++){
                                    entities.particles.push(new particle(this.layer,this.position.x,this.position.y,0,360*a/la,2,[[251,158,193]]))
                                }
                                levels[game.level][game.zone].spawnRule[this.index]=1
                            }
                        break
                        default:
                            switch(d){
                                case 0:
                                    if(c.velocity.y<0){
                                        c.position.y=this.position.y+this.height/2+c.height/2
                                        c.velocity.y=0
                                        c.velocity.x*=physics.friction.x
                                    }
                                break
                                case 1:
                                    if(c.velocity.y>0){
                                        c.position.y=this.position.y-this.height/2-c.height/2
                                        c.velocity.y=0
                                        c.jumpTime=c.base.jumpTime
                                        c.dashPhase=false
                                        if(c.dash.active==0){
                                            c.velocity.x*=physics.friction.x
                                        }
                                        if(c.dash.timer==0){
                                            c.dash.available=true
                                        }
                                        if(c.setSpawn&&c.position.x>10&&c.position.x<game.edge.x-10&&c.position.y>10&&c.position.y<game.edge.y-10){
                                            game.spawn.x=c.position.x
                                            game.spawn.y=c.position.y
                                            c.setSpawn=false
                                        }
                                    }
                                break
                                case 2:
                                    if(c.velocity.x<0){
                                        c.position.x=this.position.x+this.width/2+c.width/2
                                        c.velocity.x=0
                                        c.velocity.y*=physics.friction.y
                                    }
                                break
                                case 3:
                                    if(c.velocity.x>0){
                                        c.position.x=this.position.x-this.width/2-c.width/2
                                        c.velocity.x=0
                                        c.velocity.y*=physics.friction.y
                                    }
                                break
                            }
                        break
                    }
                }
            }
        }
    }
}