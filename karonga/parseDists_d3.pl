#!/usr/bin/perl

use strict;
use warnings;
use List::Util 'reduce';
sub minindexA { my @x=@_; reduce { $x[$a] < $x[$b] ? $a : $b } 0..$#_ }
sub minindexB {
  my @x=@_;
  my %xh;
  for (my $h=0;$h<=$#x;$h++){
    $xh{$x[$h]} = $h;
  }
  my @xs = sort {$a<=>$b} @x;
  for (my $h=0;$h<=$#xs;$h++){
    if ($xs[$h]!=0){
      return $xh{$xs[$h]};
    }
  }

}


my $x=0;
my @samples;
my $i=0;
my $newNodeNum=0;
my %newNodes;
my %dists;
open F, $ARGV[0] or die;
while(<F>){
    $_ =~ s/\"//g;
    if ($x<1){
  		$x++;
  		@samples = split /\s+/,$_;
  		next;
  	}
    my ($sample,@dists) = split /\s+/,$_;
    if (exists($newNodes{$sample})){print "$sample already merged\n";$i++;next;}
    $dists[$i]=100000;
    $i++;
    my $min = minindexA @dists;

    my @same;
    for (my $i=0;$i<=$#dists;$i++){
        if($dists[$i]==0){
          push @same, $samples[$i];
          $newNodes{$samples[$i]} = "node$newNodeNum";
          print "$sample\t$dists[$i]\t$samples[$i]\t$dists[$min]\n"
        }
    }

    if (scalar @same > 0){
      my $node = "node$newNodeNum";
      $newNodes{$sample} = $node;
      $newNodeNum++;
      my $secondMin = minindexB @dists;
      my $tempNeighbour = $samples[$secondMin];
      if (exists($newNodes{$tempNeighbour})){
        print "Found $tempNeighbour as $newNodes{$tempNeighbour}\n";
        $dists{$node}{'neighbour'} = $newNodes{$tempNeighbour}
      } else {
        $dists{$node}{'neighbour'} = $tempNeighbour;
      }

      $dists{$node}{'dist'} = $dists[$secondMin];
      print "Adding $node to Nodes with neighbour $samples[$secondMin] and distance $dists[$secondMin]\n";
    } else {
      my $tempNeighbour = $samples[$min];
      if (exists($newNodes{$tempNeighbour})){
        print "Found $tempNeighbour as $newNodes{$tempNeighbour}\n";
        $dists{$sample}{'neighbour'} = $newNodes{$tempNeighbour}
      } else {
        $dists{$sample}{'neighbour'} = $tempNeighbour;

      }
      $dists{$sample}{'dist'} = $dists[$min];
      print "Adding $sample to Nodes with neighbour $samples[$min] and distance $dists[$min]\n";
    }
}
close F;





open OUT, ">data.json" or die;
my $nodeLine;
my $edgeLine;
my @newSamples = sort keys %dists;
my %newSamples;
my $count=0;
for(@newSamples){
	$newSamples{$_} = $count;
	$count++;
}

foreach my $sample (@newSamples) {
  if ($sample =~ /node/){
    my $children;
    $nodeLine .= "\t\t{\"id\": \"$sample\",\"children\":[\n";
    foreach my $key (keys %newNodes){
      if ($newNodes{$key} eq $sample){
        $children .= "\t\t\t{\"id\": \"$key\"},\n";
      }
    }
    $children = substr($children,0,length($children)-2);
    $nodeLine .= "$children\n\t\t]},\n";
  } else {
	   $nodeLine .= "\t\t{\"id\": \"$sample\"},\n";
  }


  if (!exists($newSamples{$dists{$sample}{'neighbour'}})){
    print "Changing $dists{$sample}{'neighbour'} to $newNodes{$dists{$sample}{'neighbour'}}\n";
    $dists{$sample}{'neighbour'} = $newNodes{$dists{$sample}{'neighbour'}};
  }
  if (!exists($newSamples{$dists{$sample}{'neighbour'}})){
    print "|$sample|$dists{$sample}{'neighbour'}| not found";exit;
  }
  print "$dists{$sample}{'neighbour'}\n";
	 $edgeLine .= "\t\t{\"source\": \"$sample\", \"target\": \"$dists{$sample}{'neighbour'}\",\"value\":$dists{$sample}{'dist'}},\n";

}


print OUT "{\n\t\"nodes\":[\n", substr($nodeLine,0,length($nodeLine)-2), "\n\t],\n";
print OUT "\t\"edges\":[\n", substr($edgeLine,0,length($edgeLine)-2), "\n\t\t]\n}";
close OUT;
