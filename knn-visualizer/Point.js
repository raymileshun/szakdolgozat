const offset=20;
let cols=['orange','brown','white','purple'];
let closeColor='red'

function Point(){
  this.x=random(offset,width-offset);
  this.y=random(offset,height-offset);
  this.classId =getClassIdForCoordinates(this.x,this.y);


  this.show= function(){
    stroke(cols[this.classId]);

    strokeWeight(10);
    point(this.x,this.y)
  }
}

function getClassIdForCoordinates(x,y){
  if(x<width/2 && y<height/2){
      return 0;
  } else if(x>width/2 && y<height/2){
      return 1;
  } else if(x<width/2 && y>height/2){
      return 3;
  } else if(x>width/2 && y>height/2){
      return 2;
  }
}
